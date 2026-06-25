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
        } finally {
            setLoading(false);
        }
    };

    const handleDeletar = async (passagem) => {
        if (!isAdmin) return;
        if (window.confirm(`Excluir a passagem de "${passagem.solicitanteNome}" para "${passagem.destino}"?`)) {
            try {
                await passagemService.deletar(passagem.id);
                toast.success('✅ Passagem excluída!');
                carregarPassagens();
            } catch (error) {
                toast.error(error.response?.data?.mensagem || '❌ Erro ao excluir');
            }
        }
    };

    const badgeStatus = (status) => {
        switch (status) {
            case 'APROVADO': return <span className="badge bg-success">✅ Aprovado</span>;
            case 'REJEITADO': return <span className="badge bg-danger">❌ Rejeitado</span>;
            default: return <span className="badge bg-warning text-dark">⏳ Pendente</span>;
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
                                <th>Solicitante</th>
                                <th>Registro</th>
                                <th>Destino</th>
                                <th>Motivo</th>
                                <th>Status</th>
                                {isAdmin && <th className="text-center">Ações</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {passagens.length === 0 ? (
                                <tr>
                                    <td colSpan={isAdmin ? '6' : '5'} className="text-center text-muted">
                                        Nenhuma passagem cadastrada
                                    </td>
                                </tr>
                            ) : (
                                passagens.map((passagem) => (
                                    <tr key={passagem.id}>
                                        <td>{passagem.solicitanteNome || '-'}</td>
                                        <td>{passagem.solicitanteRegistro || '-'}</td>
                                        <td>{passagem.destino}</td>
                                        <td>{passagem.motivo || '-'}</td>
                                        <td>{badgeStatus(passagem.status)}</td>
                                        {isAdmin && (
                                            <td className="text-center text-nowrap">
                                                <button onClick={() => onEditar(passagem)} className="btn btn-sm btn-warning me-2">✏️ Editar</button>
                                                <button onClick={() => handleDeletar(passagem)} className="btn btn-sm btn-danger">🗑️ Excluir</button>
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