import { useEffect, useState } from "react"
import { UserList } from "@/components/users/UserList"
import { getUsers } from "@/services/userService"
import type { User } from "@/types/User"
import { CardContent } from "@/components/ui/card"
import { CustomCard } from "@/components/ui/custom-card"
import { ButtonWithNavIcon } from "@/components/ui/button-with-nav-icon"

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      try {
        const data = await getUsers()
        setUsers(data)
      } catch (err) {
        setError(err as Error)
        
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <CustomCard
          cardName="Listagem de Usuários"
          cardAction={<ButtonWithNavIcon path="/users/new" />}
          cardContent={
            <CardContent className="pt-0">
              <UserList users={users} isLoading={isLoading} error={error} />
            </CardContent>
          }
        />
      </div>
    </div>
  )
}
