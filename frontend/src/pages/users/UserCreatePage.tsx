import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserForm } from '@/components/users/UserForm'
import { createUser } from '@/services/userService'
import type { CreateUserType } from '@/lib/schemas/userSchemas'
import { Card, CardContent } from '@/components/ui/card'

export function UserCreatePage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const handleSubmit = async (data: CreateUserType) => {
    setIsLoading(true)
    setError(null)
    try {
      await createUser(data)
      
      navigate('/users')
    } catch (err) {
      setError(err as Error)
      
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 ">
        <Card className="bg-[#252525] border-none text-white max-w-md mx-auto w-[600px]">
          <div className="p-4">
            <h2 className="text-sm font-medium">Create User</h2>
          </div>
          <CardContent className="pt-0">
            {error && (
              <div className="mb-4 p-3 rounded-md bg-red-900/20 border border-red-500/30">
                <p className="text-red-400 text-sm">Erro: {error.message}</p>
              </div>
            )}
            <UserForm
              onSubmit={handleSubmit as (data: CreateUserType) => Promise<void>}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
