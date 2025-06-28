import { useEffect, useState } from 'react'
import { UserList } from '@/components/users/UserList'
import { getUsers } from '@/services/userService'
import type { User } from '@/types/User'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from 'react-router-dom'

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
        console.error('Failed to fetch users:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className="space-y-6">
      {/* Content grid */}
      <div className="grid grid-cols-1 gap-6">
        {/* List Users Card */}
        <Card className="bg-[#252525] border-none text-white">
          <div className="p-4 flex justify-between items-center">
            <h2 className="text-sm font-medium">List Users</h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-white"
              asChild
            >
              <Link to="/users/new">
                <PlusIcon className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <CardContent className="pt-0">
            <UserList users={users} isLoading={isLoading} error={error} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
