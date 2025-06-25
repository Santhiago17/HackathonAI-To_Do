import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserForm } from '@/components/users/UserForm';
import { getUserById, updateUser, type User } from '@/services/userService';
import type { UpdateUserType, CreateUserType } from '@/lib/schemas/userSchemas'; // Ensure CreateUserType is imported if used in the union type for onSubmit
// import { useToast } from "@/components/ui/use-toast";

export function UserEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  // const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) {
        setError(new Error("ID do usuário não fornecido."));
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const data = await getUserById(id);
        if (data) {
          setUser(data);
        } else {
          setError(new Error("Usuário não encontrado."));
          // toast({ title: "Erro", description: "Usuário não encontrado.", variant: "destructive" });
        }
      } catch (err) {
        setError(err as Error);
        // toast({ title: "Erro", description: "Falha ao buscar dados do usuário.", variant: "destructive" });
        console.error("Failed to fetch user:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleSubmit = async (data: UpdateUserType) => {
    if (!id) {
      // toast({ title: "Erro", description: "ID do usuário inválido.", variant: "destructive" });
      console.error("User ID is invalid");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await updateUser(id, data);
      // toast({ title: "Sucesso", description: "Usuário atualizado com sucesso!" });
      console.log("Usuário atualizado com sucesso!");
      navigate('/users');
    } catch (err) {
      setError(err as Error);
      // toast({ title: "Erro", description: "Falha ao atualizar usuário.", variant: "destructive" });
      console.error("Failed to update user:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto py-10"><p>Carregando dados do usuário...</p></div>;
  }

  if (error && !user) { // Show error only if user data couldn't be loaded
    return <div className="container mx-auto py-10"><p>Erro: {error.message}</p></div>;
  }
  
  if (!user) {
    return <div className="container mx-auto py-10"><p>Usuário não encontrado.</p></div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Editar Usuário: {user.name}</h1>
      {error && <p className="text-red-500 mb-4">Erro ao submeter: {error.message}</p>}
      <UserForm
        onSubmit={handleSubmit as (data: CreateUserType | UpdateUserType) => Promise<void>}
        initialData={user}
        isEditMode={true}
        isLoading={isSubmitting}
      />
    </div>
  );
}
