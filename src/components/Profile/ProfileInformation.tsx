'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  userInfoSchema,
  UserInfoFields,
} from '@/utils/validators/userInfoSchema';
import { Save, User } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import InputField from '@/components/auth/InputField';
import { Form } from '@/components/ui/form';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { updateUserInfoAction } from '@/actions/user';

interface ProfileInformationProps {
  name: string;
  email: string;
  username: string;
}

export default function ProfileInformation({
  name,
  email,
  username,
}: ProfileInformationProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<UserInfoFields>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: { name, email, username },
  });

  const onSubmit = async (values: UserInfoFields) => {
    startTransition(async () => {
      try {
        const response = await updateUserInfoAction(values);

        if (response.status === 200) {
          toast.success('Profile updated successfully');
        } else {
          toast.error('Failed to update profile', {
            description: 'An unexpected error occurred',
          });
        }
      } catch {
        toast.error('Request failed', {
          description: 'Please try again later',
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Información Personal
        </CardTitle>
        <CardDescription>
          Actualiza tu información básica de perfil
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <InputField
              control={form.control}
              id="name"
              name="name"
              label="Nombre completo"
              placeholder="Tu nombre"
              type="text"
              required
              disabled={isPending}
            />

            <InputField
              control={form.control}
              id="email"
              name="email"
              label="Correo electrónico"
              placeholder="tu@email.com"
              type="email"
              required
              disabled={isPending}
            />

            <InputField
              control={form.control}
              id="username"
              name="username"
              label="Nombre de usuario"
              placeholder="ej: le_diaz"
              type="text"
              required
              disabled={isPending}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios
            </Button>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
