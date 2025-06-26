import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui components are installed
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'; // Assuming shadcn/ui components are installed
import { Input } from '@/components/ui/input'; // Assuming shadcn/ui components are installed
import { createUserSchema, updateUserSchema, type CreateUserType, type UpdateUserType } from '@/lib/schemas/userSchemas';
import type { User } from '@/services/userService';

interface UserFormProps {
  onSubmit: (data: CreateUserType | UpdateUserType) => Promise<void>;
  initialData?: User;
  isEditMode?: boolean;
  isLoading?: boolean;
}

export function UserForm({ onSubmit, initialData, isEditMode = false, isLoading = false }: UserFormProps) {
  const schema = isEditMode ? updateUserSchema : createUserSchema;
  type FormDataType = z.infer<typeof schema>;

  const form = useForm<FormDataType>({
    resolver: zodResolver(schema),
    defaultValues: isEditMode && initialData 
      ? { 
          name: initialData.name, 
          email: initialData.email 
        } 
      : {
          name: '',
          email: '',
          ...( !isEditMode && { password: '' }), // Add password only for create mode
        },
  });

  const handleFormSubmit = async (data: FormDataType) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="seu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!isEditMode && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (isEditMode ? 'Salvando...' : 'Criando...') : (isEditMode ? 'Salvar Alterações' : 'Criar Usuário')}
        </Button>
      </form>
    </Form>
  );
}
