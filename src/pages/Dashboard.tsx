import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Filter, SortAsc, SortDesc, Trash2, Edit, Save } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { User } from '../types';
import Button from '../components/Button';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import Input from '../components/Input';

const Dashboard: React.FC = () => {
  const { users, inactiveUsers, loading, fetchUsers, fetchInactiveUsers, deleteUser, updateUser } = useUsers();
  const [selectedTab, setSelectedTab] = useState<'all' | 'inactive'>('all');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; email: string; role: 'admin' | 'user' }>({ name: '', email: '', role: 'user' });
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    if (selectedTab === 'all') {
      fetchUsers({ role: roleFilter || undefined, sortBy, order: sortOrder });
    } else {
      fetchInactiveUsers();
    }
  }, [selectedTab, roleFilter, sortBy, sortOrder]);

  useEffect(() => {
    if (userToEdit) {
      setEditForm({ name: userToEdit.name, email: userToEdit.email, role: userToEdit.role });
    }
  }, [userToEdit]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setSortOrder('ASC');
    }
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete.id);
      setDeleteModalOpen(false);
      setUserToDelete(null);
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

  const getStatusBadge = (user: User) => {
    if (!user.lastLogin) {
      return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">Nunca logou</span>;
    }
    const lastLogin = new Date(user.lastLogin);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    if (lastLogin < thirtyDaysAgo) {
      return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600">Inativo</span>;
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">Ativo</span>;
  };

  const getRoleBadge = (role: string) => {
    const isAdmin = role === 'admin';
    return (
      <span className={`px-2 py-1 text-xs rounded-full font-medium ${isAdmin ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
        {isAdmin ? 'Admin' : 'Usuário'}
      </span>
    );
  };

  const currentUsers = selectedTab === 'all' ? users : inactiveUsers;

  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setEditModalOpen(true);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToEdit) return;
    setEditLoading(true);
    try {
      await updateUser(userToEdit.id, editForm);
      setEditModalOpen(false);
      setUserToEdit(null);
      await fetchUsers();
    } catch {
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Administrativo</h1>
        <p className="text-gray-600">Gerencie usuários e monitore atividade do sistema</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <UserCheck className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(user => {
                  if (!user.lastLogin) return false;
                  const lastLogin = new Date(user.lastLogin);
                  const thirtyDaysAgo = new Date();
                  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                  return lastLogin >= thirtyDaysAgo;
                }).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <UserX className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Usuários Inativos</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(user => {
                  if (!user.lastLogin) return true;
                  const lastLogin = new Date(user.lastLogin);
                  const thirtyDaysAgo = new Date();
                  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                  return lastLogin < thirtyDaysAgo;
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setSelectedTab('all')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${selectedTab === 'all'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Todos os Usuários
            </button>
            <button
              onClick={() => setSelectedTab('inactive')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${selectedTab === 'inactive'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Usuários Inativos
            </button>
          </nav>
        </div>
      </div>
      {selectedTab === 'all' && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos os papéis</option>
                <option value="admin">Administradores</option>
                <option value="user">Usuários</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Ordenar por:</span>
              <button
                onClick={() => handleSort('name')}
                className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm ${sortBy === 'name' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <span>Nome</span>
                {sortBy === 'name' && (
                  sortOrder === 'ASC' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                )}
              </button>
              <button
                onClick={() => handleSort('createdAt')}
                className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm ${sortBy === 'createdAt' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <span>Data</span>
                {sortBy === 'createdAt' && (
                  sortOrder === 'ASC' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Papel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Criado em
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin ? formatDate(user.lastLogin) : 'Nunca'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Button icon={<Edit className="w-4 h-4" />} onClick={() => handleEditUser(user)} variant="secondary" size="small">
                        Editar
                      </Button>
                      <Button icon={<Trash2 className="w-4 h-4" />} onClick={() => handleDeleteUser(user)} variant="danger" size="small">
                        Excluir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {currentUsers.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                {selectedTab === 'all' ? 'Nenhum usuário encontrado' : 'Nenhum usuário inativo encontrado'}
              </div>
            )}
          </div>
        )}
      </div>
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirmar Exclusão"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Tem certeza que deseja excluir o usuário <strong>{userToDelete?.name}</strong>?
            Esta ação não pode ser desfeita.
          </p>
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Excluir
            </Button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Editar Usuário">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Nome"
            name="name"
            type="text"
            value={editForm.name}
            onChange={handleEditFormChange}
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={editForm.email}
            onChange={handleEditFormChange}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Papel</label>
            <select
              name="role"
              value={editForm.role}
              onChange={handleEditFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="user">Usuário</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={() => setEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" loading={editLoading} icon={<Save className="w-4 h-4" />}>
              Salvar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;