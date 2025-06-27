import type { User } from '@/types/User'

interface UserCardProps {
  user: User
}

const getInitials = (name: string) => {
  const names = name.split(' ')
  const firstName = names[0]?.[0] || ''
  const lastName = names.length > 1 ? names[names.length - 1]?.[0] || '' : ''
  return `${firstName}${lastName}`.toUpperCase()
}

const formatBirthDate = (birthDate: string) => {
  const year = birthDate.substring(0, 4)
  const month = birthDate.substring(4, 6)
  const day = birthDate.substring(6, 8)
  return `${day}/${month}/${year}`
}

export function UserCard({ user }: UserCardProps) {
  return (
    <div className="flex items-center space-x-2 py-2">
      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-r from-yellow-500 to-red-500 text-white text-xs font-bold">
        {getInitials(user.name)}
      </div>
      <div className="flex-1">
        <div className="text-sm text-gray-300 font-medium">{user.name}</div>
        <div className="text-xs text-gray-400">
          Nascimento: {formatBirthDate(user.birthDate)}
        </div>
      </div>
    </div>
  )
}
