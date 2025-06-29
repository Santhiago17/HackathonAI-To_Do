import { UserCard } from "@/components/users/UserCard"
import type { User } from "@/types/User"

export function DashboardUsersContent({
  users,
  loading,
}: {
  users: User[]
  loading: boolean
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
        <p className="ml-2 text-sm text-gray-500">Carregando usuários...</p>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-500">Nenhum usuário encontrado</p>
        <p className="text-xs text-gray-400 mt-1">
          Clique no botão acima para adicionar um novo usuário
        </p>
      </div>
    )
  }

  return (
    <ul className="space-y-2 max-h-64 overflow-y-auto">
      {users.map((user) => (
        <li
          key={user.id}
          className="hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors cursor-pointer"
        >
          <UserCard
            user={{
              name: user.name,
            }}
            className="py-1.5 px-1"
          />
        </li>
      ))}
    </ul>
  )
}
