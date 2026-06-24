import React, { useState, useEffect } from 'react';
import { passagemService } from '../services/api';
import { toast } from 'react-toastify';

function PassagemLista({ onEditar, recarregar }) {
    const [passagens, setPassagens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    // detecta se é ADMIN baseado na prop onEditar (igual ComputadorLista)
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

    // formata valor pra R$ (ex: 1250.5 -> R$ 1.250,50)
    const formatarValor = (valor) => {
        if (valor === null || valor === undefined) return '-';
        return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    // formata data (ex: 2026-07-10 -> 10/07/2026)
    const formatarData = (data) => {
        if (!data) return '-';
        return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
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
                                {isAdmin && <th className="text-center">Ações</th>}
                            </tr>
                        </thead>

                        <tbody>
                            {passagens.length === 0 ? (
                                <tr>
                                    <td colSpan={isAdmin ? '8' : '7'} className="text-center text-muted">
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