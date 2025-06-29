import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import type React from "react"

export interface UserCardProps {
  user: {
    name: string
    description?: React.ReactNode
    image?: string
  }
  className?: string
}

const getInitials = (name: string) => {
  const names = name.split(" ")
  const firstName = names[0]?.[0] || ""
  const lastName = names.length > 1 ? names[names.length - 1]?.[0] || "" : ""
  return `${firstName}${lastName}`.toUpperCase()
}

export function UserCard({ user, className = "" }: UserCardProps) {
  return (
    <div className={cn("flex items-center space-x-2", className || "py-2")}>
      <Avatar>
        <AvatarImage src={user.image} className="w-10 rounded-full" />
        <AvatarFallback className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-r from-yellow-500 to-red-500 text-white text-xs font-bold">
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="text-sm text-gray-300 font-medium">{user.name}</div>
        {user.description && (
          <div className="text-xs text-gray-400">{user.description}</div>
        )}
      </div>
    </div>
  )
}
