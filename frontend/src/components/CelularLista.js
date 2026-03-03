import React, { useState, useEffect } from 'react';
import { celularService } from '../services/api';

function CelularLista({ onEditar }) {
    const [celulares, setCelulares] = useState([]);
    const [loading, setloading] = useState(true);
    const [erro, setErro] = useState(null);

    // 🔥 Detecta se é ADMIN baseado na prop onEditar
    const isAdmin = !!onEditar;

    useEffect(() => {
        carregarCelulares();
    }, []);

    const carregarCelulares = async () => {
        try {
            setloading(true);
            const response = await celularService.listarTodos();
            setCelulares(response.data);
            setErro(null);
        } catch (error) {
            setErro('Erro ao carregar celulares');
            console.error(error);
        } finally {
            setloading(false);
        }
    };

    // 🔒 Só ADMIN pode mudar status
    const handleMudarStatus = async (celular, novoStatus) => {

        if (!isAdmin) return; // 🛑 bloqueia USER

        if (window.confirm(`Alterar status de "${celular.modelo}" para "${novoStatus}"?`)) {
            try {
                await celularService.atualizar(celular.imei, {
                    ...celular,
                    status: novoStatus
                });
                carregarCelulares();
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
                <h5 className="mb-0">📋 Lista de Celulares</h5>
            </div>

            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>IMEI</th>
                                <th>Modelo</th>
                                <th>Status</th>
                                <th>Operadora</th>
                                <th>Data Aquisição</th>
                                <th>Vida Útil</th>

                                {/* 🔥 Só ADMIN vê coluna Ações */}
                                {isAdmin && (
                                    <th className="text-center">Ações</th>
                                )}
                            </tr>
                        </thead>

                        <tbody>
                            {celulares.length === 0 ? (
                                <tr>
                                    <td colSpan={isAdmin ? "7" : "6"} className="text-center text-muted">
                                        Nenhum celular cadastrado
                                    </td>
                                </tr>
                            ) : (
                                celulares.map((celular) => (
                                    <tr key={celular.imei}>
                                        <td>{celular.imei}</td>
                                        <td>{celular.modelo}</td>

                                        <td>
                                            <span className={`badge ${
                                                celular.status === 'em estoque' ? 'bg-success' :
                                                celular.status === 'entregue' ? 'bg-primary' :
                                                celular.status === 'manutencao' ? 'bg-warning text-dark' :
                                                celular.status === 'baixado' ? 'bg-danger' :
                                                'bg-secondary'
                                            }`}>
                                                {celular.status}
                                            </span>
                                        </td>

                                        <td>{celular.fornecedor || '-'}</td>
                                        <td>{new Date(celular.dataAquisicao).toLocaleDateString('pt-BR')}</td>
                                        <td>{celular.vidaUtil} meses</td>

                                        {/* 🔥 AÇÕES APENAS PARA ADMIN */}
                                        {isAdmin && (
                                            <td className="text-center text-nowrap">
                                                
                                                {/* ✏️ Editar */}
                                                <button
                                                    onClick={() => onEditar(celular)}
                                                    className="btn btn-sm btn-warning me-2"
                                                >
                                                    ✏️ Editar
                                                </button>

                                                {/* 📦 Estoque */}
                                                <button
                                                    onClick={() => handleMudarStatus(celular, 'em estoque')}
                                                    className="btn btn-sm btn-success me-2"
                                                    disabled={celular.status === 'em estoque'}
                                                >
                                                    📦 Estoque
                                                </button>

                                                {/* 🔧 Manutenção */}
                                                <button
                                                    onClick={() => handleMudarStatus(celular, 'manutencao')}
                                                    className="btn btn-sm btn-warning me-2"
                                                    disabled={celular.status === 'manutencao'}
                                                >
                                                    🔧 Manutenção
                                                </button>

                                                {/* 🗑️ Baixar */}
                                                <button
                                                    onClick={() => handleMudarStatus(celular, 'baixado')}
                                                    className="btn btn-sm btn-danger"
                                                    disabled={celular.status === 'baixado'}
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

export default CelularLista;