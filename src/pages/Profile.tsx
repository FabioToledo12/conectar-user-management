import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, Lock, Save, Edit } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/auth';
import { usersApi } from '../services/api';
import { UpdateProfileData } from '../types';
import Input from '../components/Input';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<UpdateProfileData & { confirmPassword?: string }>();

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: UpdateProfileData & { confirmPassword?: string }) => {
    setLoading(true);
    try {
      const updateData: UpdateProfileData = { name: data.name };
      
      if (data.password) {
        updateData.password = data.password;
      }

      const updatedUser = await usersApi.updateProfile(updateData);
      setUser(updatedUser);
      setEditing(false);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Meu Perfil</h1>
        <p className="text-gray-600">Gerencie suas informações pessoais</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-6 text-white">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-blue-100">{user.email}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                user.role === 'admin' 
                  ? 'bg-yellow-400 text-yellow-900' 
                  : 'bg-blue-200 text-blue-900'
              }`}>
                {user.role === 'admin' ? 'Administrador' : 'Usuário'}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!editing ? (
            /* View Mode */
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nome</label>
                  <p className="mt-1 text-lg text-gray-900">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="mt-1 text-lg text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Papel</label>
                  <p className="mt-1 text-lg text-gray-900 capitalize">{user.role}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="mt-1">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      user.isActive 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {user.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Último Login</label>
                  <p className="mt-1 text-lg text-gray-900">
                    {user.lastLogin ? formatDate(user.lastLogin) : 'Nunca'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Membro desde</label>
                  <p className="mt-1 text-lg text-gray-900">{formatDate(user.createdAt)}</p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => setEditing(true)}
                  icon={<Edit className="w-4 h-4" />}
                >
                  Editar Perfil
                </Button>
              </div>
            </div>
          ) : (
            /* Edit Mode */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Input
                    label="Nome Completo"
                    type="text"
                    icon={<User className="w-5 h-5" />}
                    error={errors.name?.message}
                    {...register('name', {
                      required: 'Nome é obrigatório',
                      minLength: {
                        value: 2,
                        message: 'Nome deve ter pelo menos 2 caracteres',
                      },
                      maxLength: {
                        value: 100,
                        message: 'Nome deve ter no máximo 100 caracteres',
                      },
                    })}
                  />
                </div>

                <div>
                  <Input
                    label="Nova Senha (opcional)"
                    type="password"
                    icon={<Lock className="w-5 h-5" />}
                    error={errors.password?.message}
                    {...register('password', {
                      minLength: {
                        value: 6,
                        message: 'Senha deve ter pelo menos 6 caracteres',
                      },
                    })}
                  />
                </div>

                <div>
                  <Input
                    label="Confirmar Nova Senha"
                    type="password"
                    icon={<Lock className="w-5 h-5" />}
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword', {
                      validate: (value, { password }) => {
                        if (password && !value) {
                          return 'Confirmação de senha é obrigatória';
                        }
                        if (password && value !== password) {
                          return 'As senhas não coincidem';
                        }
                        return true;
                      },
                    })}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setEditing(false);
                    reset({ name: user.name });
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  icon={<Save className="w-4 h-4" />}
                >
                  Salvar Alterações
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;