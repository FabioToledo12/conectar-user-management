import { useState, useEffect } from 'react';
import { User } from '../types';
import { usersApi } from '../services/api';
import { toast } from 'react-hot-toast';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [inactiveUsers, setInactiveUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (params?: { role?: string; sortBy?: string; order?: string }) => {
    setLoading(true);
    try {
      const data = await usersApi.getAllUsers(params);
      setUsers(data);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const fetchInactiveUsers = async () => {
    setLoading(true);
    try {
      const data = await usersApi.getInactiveUsers();
      setInactiveUsers(data);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Erro ao carregar usuários inativos');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await usersApi.deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
      toast.success('Usuário excluído com sucesso');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Erro ao excluir usuário');
    }
  };

  const updateUser = async (id: string, data: Partial<User>) => {
    setLoading(true);
    try {
      const updated = await usersApi.updateUser(id, data);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
      toast.success('Usuário atualizado com sucesso');
      return updated;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Erro ao atualizar usuário');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    inactiveUsers,
    loading,
    fetchUsers,
    fetchInactiveUsers,
    deleteUser,
    updateUser,
  };
};