import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Assuming shadcn/ui components are installed
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { User } from "@/services/userService";

interface UserListProps {
  users: User[];
  isLoading: boolean;
  error: Error | null;
  onDelete?: (userId: string) => void; // Optional: if delete functionality is added
}

export function UserList({ users, isLoading, error, onDelete }: UserListProps) {
  if (isLoading) {
    return <p>Carregando usuários...</p>;
  }

  if (error) {
    return <p>Erro ao carregar usuários: {error.message || JSON.stringify(error)}</p>;
  }

  if (!users || users.length === 0) {
    return <p>Nenhum usuário encontrado.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.id}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell className="text-right space-x-2">
              <Button asChild variant="outline" size="sm">
                <Link to={`/users/${user.id}/edit`}>Editar</Link>
              </Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(user.id)}>
                  Excluir
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
