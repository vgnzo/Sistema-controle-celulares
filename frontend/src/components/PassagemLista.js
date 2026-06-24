import React, { useState, useEffect } from 'react';
import { passagemService } from '../services/api';
import { toast } from 'react-toastify';

function PassagemLista({ onEditar, recarregar }) {
    const [passagens, setPassagens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    const isAdmin = !!onEditar;

    useEffect(() => {
        carregarPassagens();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recarregar]);

    const carregarPassagens = async () => {
        try {
            setLoading(true);
            const response = await passagemService.listarTodas();
            setPassagens(response.data);
            setErro(null);
        } catch (error) {
            setErro('Erro ao carregar passagens');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletar = async (passagem) => {
        if (!isAdmin) return;
        if (window.confirm(`Excluir a passagem de "${passagem.colaborador?.nome}" para "${passagem.destino}"?`)) {
            try {
                await passagemService.deletar(passagem.id);
                toast.success('✅ Passagem excluída com sucesso!');
                carregarPassagens();
            } catch (error) {
                toast.error(error.response?.data?.mensagem || error.response?.data || '❌ Erro ao excluir');
            }
        }
    };

    const formatarValor = (valor) => {
        if (valor === null || valor === undefined) return '-';
        return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const formatarData = (data) => {
        if (!data) return '-';
        return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
    };

    // ✅ badge colorido conforme o status
    const badgeStatus = (status) => {
        switch (status) {
            case 'APROVADO':
                return <span className="badge bg-success">✅ Aprovado</span>;
            case 'REJEITADO':
                return <span className="badge bg-danger">❌ Rejeitado</span>;
            default:
                return <span className="badge bg-warning text-dark">⏳ Pendente</span>;
        }
    };

    if (loading) return <div>Carregando...</div>;
    if (erro) return <div style={{ color: 'red' }}>{erro}</div>;

    return (
        <div className="card">
            <div className="card-header">
                <h5 className="mb-0">✈️ Lista de Passagens</h5>
            </div>

            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Colaborador</th>
                                <th>Destino</th>
                                <th>Embarque</th>
                                <th>Ida</th>
                                <th>Volta</th>
                                <th>Motivo</th>
                                <th>Valor</th>
                                <th>Status</th> {/* ✅ nova coluna */}
                                {isAdmin && <th className="text-center">Ações</th>}
                            </tr>
                        </thead>

                        <tbody>
                            {passagens.length === 0 ? (
                                <tr>
                                    <td colSpan={isAdmin ? '9' : '8'} className="text-center text-muted">
                                        Nenhuma passagem cadastrada
                                    </td>
                                </tr>
                            ) : (
                                passagens.map((passagem) => (
                                    <tr key={passagem.id}>
                                        <td>{passagem.colaborador?.nome || '-'}</td>
                                        <td>{passagem.destino}</td>
                                        <td>{passagem.localEmbarque || '-'}</td>
                                        <td>{formatarData(passagem.dataIda)}</td>
                                        <td>{passagem.dataVolta ? formatarData(passagem.dataVolta) : '🔂 Só ida'}</td>
                                        <td>{passagem.motivo || '-'}</td>
                                        <td>{formatarValor(passagem.valor)}</td>
                                        <td>{badgeStatus(passagem.status)}</td> {/* ✅ */}

                                        {isAdmin && (
                                            <td className="text-center text-nowrap">
                                                <button
                                                    onClick={() => onEditar(passagem)}
                                                    className="btn btn-sm btn-warning me-2"
                                                >
                                                    ✏️ Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDeletar(passagem)}
                                                    className="btn btn-sm btn-danger"
                                                >
                                                    🗑️ Excluir
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

export default PassagemLista;