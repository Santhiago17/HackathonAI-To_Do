import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserList } from '@/components/users/UserList';
import { Button } from '@/components/ui/button';
import { getUsers, deleteUser as deleteUserService, type User } from '@/services/userService';
// You might need a toast component for feedback, e.g., from shadcn/ui
// import { useToast } from "@/components/ui/use-toast"; 

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  // const { toast } = useToast(); // If using shadcn/ui toast

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(err as Error);
      // toast({ title: "Erro", description: "Falha ao buscar usuários.", variant: "destructive" });
      console.error("Failed to fetch users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await deleteUserService(userId);
        // toast({ title: "Sucesso", description: "Usuário excluído." });
        fetchUsers(); // Refresh the list
      } catch (err) {
        setError(err as Error); // Show error in the list component or a general message
        // toast({ title: "Erro", description: "Falha ao excluir usuário.", variant: "destructive" });
        console.error("Failed to delete user:", err);
      }
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciamento de Usuários</h1>
        <Button asChild>
          <Link to="/users/new">Adicionar Novo Usuário</Link>
        </Button>
      </div>
      <UserList users={users} isLoading={isLoading} error={error} onDelete={handleDeleteUser} />
    </div>
  );
}
