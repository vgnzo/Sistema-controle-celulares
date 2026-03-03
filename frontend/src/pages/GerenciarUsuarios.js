import React, { useEffect, useState } from 'react';
import api from '../services/api';

function GerenciarUsuarios({ tipo }) {

    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🔒 Só ADMIN pode carregar
    useEffect(() => {
        if (tipo === 'ADMIN') {
            carregarUsuarios();
        }
    }, [tipo]);

    const carregarUsuarios = async () => {
        try {
            const response = await api.get('/usuarios');
            setUsuarios(response.data);
        } catch (error) {
            console.error('Erro ao carregar usuários', error);
        } finally {
            setLoading(false);
        }
    };

    // 👑 Promover para ADMIN
    const promover = async (id) => {
        if (!window.confirm('Promover usuário para ADMIN?')) return;

        try {
            await api.put(`/usuarios/${id}/promover`);
            carregarUsuarios();
        } catch (error) {
            console.error(error);
        }
    };

    // 🔽 Rebaixar para USER
    const rebaixar = async (id) => {
        if (!window.confirm('Rebaixar usuário para USER?')) return;

        try {
            await api.put(`/usuarios/${id}/rebaixar`);
            carregarUsuarios();
        } catch (error) {
            console.error(error);
        }
    };

    // 🗑️ Deletar usuário
    const deletar = async (id) => {
        if (!window.confirm('Tem certeza que deseja deletar este usuário?')) return;

        try {
            await api.delete(`/usuarios/${id}`);
            carregarUsuarios();
        } catch (error) {
            console.error(error);
        }
    };

    if (tipo !== 'ADMIN') {
        return <h3>🚫 Acesso negado</h3>;
    }

    if (loading) return <div>Carregando...</div>;

    return (
        <div className="card">
            <div className="card-header">
                <h5 className="mb-0">👑 Gerenciar Usuários</h5>
            </div>

            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Tipo</th>
                                <th className="text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((usuario) => (
                                <tr key={usuario.id}>
                                    <td>{usuario.id}</td>
                                    <td>{usuario.username}</td>

                                    <td>
                                        <span className={`badge ${
                                            usuario.tipo === 'ADMIN'
                                                ? 'bg-danger'
                                                : 'bg-secondary'
                                        }`}>
                                            {usuario.tipo}
                                        </span>
                                    </td>

                                    <td className="text-center">

                                        {usuario.tipo === 'USER' ? (
                                            <button
                                                className="btn btn-sm btn-success me-2"
                                                onClick={() => promover(usuario.id)}
                                            >
                                                👑 Promover
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-sm btn-warning me-2"
                                                onClick={() => rebaixar(usuario.id)}
                                            >
                                                🔽 Rebaixar
                                            </button>
                                        )}

                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => deletar(usuario.id)}
                                        >
                                            🗑️ Deletar
                                        </button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {usuarios.length === 0 && (
                        <p className="text-muted text-center mt-3">
                            Nenhum usuário encontrado.
                        </p>
                    )}

                </div>
            </div>
        </div>
    );
}

export default GerenciarUsuarios;