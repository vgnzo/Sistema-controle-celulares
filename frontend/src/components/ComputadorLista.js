import React, { useState, useEffect } from 'react';
import { computadorService } from '../services/api';

function ComputadorLista({ onEditar }) {
    const [computadores, setComputadores] = useState([]);
    const [loading, setloading] = useState(true);
    const [erro, setErro] = useState(null);

    // 🔥 Detecta se é ADMIN baseado na prop onEditar
    const isAdmin = !!onEditar;

   useEffect(() => {
        carregarComputadores();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const carregarComputadores = async () => {
        try {
            setloading(true);
            const response = await computadorService.listarTodos();
            setComputadores(response.data);
            setErro(null);
        } catch (error) {
            setErro('Erro ao carregar computadores');
            console.error(error);
        } finally {
            setloading(false);
        }
    };

    // 🔒 Só ADMIN pode mudar status
    const handleMudarStatus = async (computador, novoStatus) => {

        if (!isAdmin) return; // 🛑 bloqueia USER

        if (window.confirm(`Alterar status de "${computador.modelo}" para "${novoStatus}"?`)) {
            try {
                await computadorService.atualizar(computador.numeroPatrimonio, {
                    ...computador,
                    status: novoStatus
                });
                carregarComputadores();
            } catch (error) {
                alert(error.response?.data?.mensagem || 'Erro ao atualizar status');
            }
        }
    };

    if (loading) return <div>Carregando...</div>;
    if (erro) return <div style={{ color: 'red' }}>{erro}</div>;

    return (
        <div className="card">
            <div className="card-header">
                <h5 className="mb-0">💻 Lista de Computadores</h5>
            </div>

            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Patrimônio</th>
                                <th>Marca</th>
                                <th>Modelo</th>
                                <th>Status</th>
                                <th>Proprietário</th>
                                <th>Fornecedor</th>
                                <th>MAC Address</th>
                                <th>Data Aquisição</th>

                                {/* 🔥 Só ADMIN vê coluna Ações */}
                                {isAdmin && (
                                    <th className="text-center">Ações</th>
                                )}
                            </tr>
                        </thead>

                        <tbody>
                            {computadores.length === 0 ? (
                                <tr>
                                    <td colSpan={isAdmin ? "9" : "8"} className="text-center text-muted">
                                        Nenhum computador cadastrado
                                    </td>
                                </tr>
                            ) : (
                                computadores.map((computador) => (
                                    <tr key={computador.numeroPatrimonio}>
                                        <td>{computador.numeroPatrimonio}</td>
                                        <td>{computador.marca || '-'}</td>
                                        <td>{computador.modelo}</td>

                                        <td>
                                            <span className={`badge ${
                                                computador.status === 'em estoque' ? 'bg-success' :
                                                computador.status === 'entregue' ? 'bg-primary' :
                                                computador.status === 'manutencao' ? 'bg-warning text-dark' :
                                                computador.status === 'baixado' ? 'bg-danger' :
                                                'bg-secondary'
                                            }`}>
                                                {computador.status}
                                            </span>
                                        </td>

                                        <td>{computador.proprietario || '-'}</td>
                                        <td>{computador.fornecedor || '-'}</td>
                                        <td>{computador.macAddress || '-'}</td>
                                        <td>{new Date(computador.dataAquisicao).toLocaleDateString('pt-BR')}</td>

                                        {/* 🔥 AÇÕES APENAS PARA ADMIN */}
                                        {isAdmin && (
                                            <td className="text-center text-nowrap">

                                                {/* ✏️ Editar */}
                                                <button
                                                    onClick={() => onEditar(computador)}
                                                    className="btn btn-sm btn-warning me-2"
                                                >
                                                    ✏️ Editar
                                                </button>

                                                {/* 📦 Estoque */}
                                                <button
                                                    onClick={() => handleMudarStatus(computador, 'em estoque')}
                                                    className="btn btn-sm btn-success me-2"
                                                    disabled={computador.status === 'em estoque'}
                                                >
                                                    📦 Estoque
                                                </button>

                                                {/* 🔧 Manutenção */}
                                                <button
                                                    onClick={() => handleMudarStatus(computador, 'manutencao')}
                                                    className="btn btn-sm btn-warning me-2"
                                                    disabled={computador.status === 'manutencao'}
                                                >
                                                    🔧 Manutenção
                                                </button>

                                                {/* 🗑️ Baixar */}
                                                <button
                                                    onClick={() => handleMudarStatus(computador, 'baixado')}
                                                    className="btn btn-sm btn-danger"
                                                    disabled={computador.status === 'baixado'}
                                                >
                                                    🗑️ Baixar
                                                </button>

                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    );
}

export default ComputadorLista;