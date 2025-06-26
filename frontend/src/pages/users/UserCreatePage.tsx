import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserForm } from '@/components/users/UserForm';
import { createUser } from '@/services/userService'; // Removed unused 'User' type import
import type { CreateUserType } from '@/lib/schemas/userSchemas';
// import { useToast } from "@/components/ui/use-toast"; // If using shadcn/ui toast

export function UserCreatePage() {
  const navigate = useNavigate();
  // const { toast } = useToast(); // If using shadcn/ui toast
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleSubmit = async (data: CreateUserType) => {
    setIsLoading(true);
    setError(null);
    try {
      await createUser(data);
      // toast({ title: "Sucesso", description: "Usuário criado com sucesso!" });
      console.log("Usuário criado com sucesso!"); // Placeholder for toast
      navigate('/users');
    } catch (err) {
      setError(err as Error);
      // toast({ title: "Erro", description: "Falha ao criar usuário.", variant: "destructive" });
      console.error("Failed to create user:", err); // Placeholder for toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Criar Novo Usuário</h1>
      {error && <p className="text-red-500 mb-4">Erro: {error.message}</p>}
      <UserForm 
        onSubmit={handleSubmit as (data: CreateUserType | import('@/lib/schemas/userSchemas').UpdateUserType) => Promise<void>} 
        isEditMode={false} 
        isLoading={isLoading} 
      />
    </div>
  );
}
