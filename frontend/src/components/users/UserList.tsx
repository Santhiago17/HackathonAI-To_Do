import type { User } from '@/types/User'
import { UserCard } from './UserCard.tsx'

interface UserListProps {
  users: User[]
  isLoading: boolean
  error: Error | null
}

export function UserList({ users, isLoading, error }: UserListProps) {
  if (isLoading) {
    return <p className="text-gray-300 text-sm">Carregando usuários...</p>
  }

  if (error) {
    return (
      <p className="text-red-400 text-sm">
        Erro ao carregar usuários: {error.message}
      </p>
    )
  }

  if (!users || users.length === 0) {
    return <p className="text-gray-300 text-sm">Nenhum usuário encontrado.</p>
  }

  return (
    <div className="space-y-3">
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}
