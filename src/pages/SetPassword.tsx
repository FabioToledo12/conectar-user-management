import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Lock, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { usersApi } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';

const SetPassword: React.FC = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, watch } = useForm<{ password: string; confirmPassword: string }>();
    const [loading, setLoading] = useState(false);
    const password = watch('password');

    const onSubmit = async (data: { password: string; confirmPassword: string }) => {
        setLoading(true);
        try {
            await usersApi.updateProfile({ password: data.password });
            toast.success('Senha definida/atualizada com sucesso!');
            navigate('/profile');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erro ao definir senha');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Definir/Alterar Senha</h2>
                    <p className="text-sm text-gray-600 mb-4">Escolha uma nova senha para acessar também pelo formulário tradicional.</p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        label="Nova Senha"
                        type="password"
                        icon={<Lock className="w-5 h-5" />}
                        error={errors.password?.message}
                        {...register('password', {
                            required: 'Senha é obrigatória',
                            minLength: {
                                value: 6,
                                message: 'Senha deve ter pelo menos 6 caracteres',
                            },
                        })}
                    />
                    <Input
                        label="Confirmar Nova Senha"
                        type="password"
                        icon={<Lock className="w-5 h-5" />}
                        error={errors.confirmPassword?.message}
                        {...register('confirmPassword', {
                            required: 'Confirmação de senha é obrigatória',
                            validate: (value) => value === password || 'As senhas não coincidem',
                        })}
                    />
                    <Button
                        type="submit"
                        className="w-full"
                        loading={loading}
                        icon={<Save className="w-5 h-5" />}
                    >
                        Salvar Senha
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default SetPassword; 