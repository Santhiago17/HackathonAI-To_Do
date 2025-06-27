import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserType,
} from '@/lib/schemas/userSchemas'
import type { User } from '@/types/User'

interface UserFormProps {
  onSubmit: (data: CreateUserType) => Promise<void>
  initialData?: User
  isEditMode?: boolean
  isLoading?: boolean
}

export function UserForm({
  onSubmit,
  initialData,
  isEditMode = false,
  isLoading = false
}: UserFormProps) {
  const schema = isEditMode ? updateUserSchema : createUserSchema
  type FormDataType = z.infer<typeof schema>

  const form = useForm<FormDataType>({
    resolver: zodResolver(schema),
    defaultValues:
      isEditMode && initialData
        ? {
            firstName: initialData.firstName,
            lastName: initialData.lastName,
            birthDate: initialData.birthDate
          }
        : {
            firstName: '',
            lastName: '',
            birthDate: ''
          }
  })

  const handleFormSubmit = async (data: FormDataType) => {
    await onSubmit(data)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Nome</FormLabel>
              <FormControl>
                <Input
                  placeholder="Primeiro nome"
                  {...field}
                  className="bg-[#1a1a1a] border-gray-600 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500/20"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Sobrenome</FormLabel>
              <FormControl>
                <Input
                  placeholder="Último nome"
                  {...field}
                  className="bg-[#1a1a1a] border-gray-600 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500/20"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">
                Data de Nascimento
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="YYYYMMDD (ex: 19900101)"
                  {...field}
                  className="bg-[#1a1a1a] border-gray-600 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500/20"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 transition-colors duration-200"
        >
          {isLoading
            ? isEditMode
              ? 'Salvando...'
              : 'Criando...'
            : isEditMode
            ? 'Salvar Alterações'
            : 'Criar Usuário'}
        </Button>
      </form>
    </Form>
  )
}
