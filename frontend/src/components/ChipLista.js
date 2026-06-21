import React, { useState, useEffect } from 'react';
import { chipService, vinculoChipService } from '../services/api';

function ChipLista({ onEditar }) {
    const [chips, setChips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    // Detecta se é ADMIN baseado na prop onEditar
    const isAdmin = !!onEditar;

    useEffect(() => {
        carregarChips();
    }, []);

    const carregarChips = async () => {
        try {
            setLoading(true);
            const response = await chipService.listarTodos();
            setChips(response.data);
            setErro(null);
        } catch (error) {
            setErro('Erro ao carregar chips');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // 🔒 Só ADMIN pode deletar
    const handleDeletar = async (chip) => {
        if (!isAdmin) return;

        if (window.confirm(`Deletar o chip "${chip.iccid}"?`)) {
            try {
                await chipService.deletar(chip.iccid);
                carregarChips();
            } catch (error) {
                alert(error.response?.data?.mensagem || 'Erro ao deletar chip');
            }
        }
    };

    // ⚠️ Marca o chip como "com problema". Se estiver em uso, desvincula do celular primeiro.
    const handleMarcarProblema = async (chip) => {
        if (!isAdmin) return;
        if (!window.confirm(`Marcar o chip "${chip.iccid}" como COM PROBLEMA? (se estiver num celular, ele será removido)`)) return;

        try {
            // se estiver em uso, acha o celular e desvincula
            if (chip.status === 'em uso') {
                const hist = await vinculoChipService.historicoPorChip(chip.iccid);
                const vinculoAtivo = hist.data.find(v => !v.dataFim);
                if (vinculoAtivo && vinculoAtivo.celular) {
                    await vinculoChipService.desvincular(vinculoAtivo.celular.imei);
                }
            }
            // marca como com problema (sobrescreve o "disponivel" que o desvincular setou)
            await chipService.atualizar(chip.iccid, { ...chip, status: 'com problema' });
            carregarChips();
        } catch (error) {
            alert(error.response?.data?.mensagem || error.response?.data || 'Erro ao marcar problema');
        }
    };

    // ✅ Volta o chip para "disponivel" (problema resolvido)
    const handleResolver = async (chip) => {
        if (!isAdmin) return;
        try {
            await chipService.atualizar(chip.iccid, { ...chip, status: 'disponivel' });
            carregarChips();
        } catch (error) {
            alert(error.response?.data?.mensagem || error.response?.data || 'Erro ao atualizar');
        }
    };

    if (loading) return <div>Carregando...</div>;
    if (erro) return <div style={{ color: 'red' }}>{erro}</div>;

    // 🔎 chips com problema (pra o alerta do topo)
    const chipsComProblema = chips.filter(c => c.status === 'com problema');

    return (
        <div className="card">
            <div className="card-header">
                <h5 className="mb-0">📋 Lista de Chips</h5>
            </div>

            <div className="card-body">

                {/* ⚠️ Alerta de chips com problema */}
                {chipsComProblema.length > 0 && (
                    <div className="alert alert-warning">
                        ⚠️ <strong>{chipsComProblema.length}</strong> chip(s) com problema — precisam de atenção.
                    </div>
                )}

                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>ICCID</th>
                                <th>Número da Linha</th>
                                <th>Operadora</th>
                                <th>Status</th>

                                {/* Só ADMIN vê coluna Ações */}
                                {isAdmin && (
                                    <th className="text-center">Ações</th>
                                )}
                            </tr>
                        </thead>

                        <tbody>
                            {chips.length === 0 ? (
                                <tr>
                                    <td colSpan={isAdmin ? "5" : "4"} className="text-center text-muted">
                                        Nenhum chip cadastrado
                                    </td>
                                </tr>
                            ) : (
                                chips.map((chip) => (
                                    // 🔴 destaca a linha se o chip estiver com problema
                                    <tr key={chip.iccid} className={chip.status === 'com problema' ? 'table-warning' : ''}>
                                        <td>{chip.iccid}</td>
                                        <td>{chip.numeroLinha || '-'}</td>
                                        <td>{chip.operadora || '-'}</td>

                                        <td>
                                            <span className={`badge ${
                                                chip.status === 'disponivel' ? 'bg-success' :
                                                chip.status === 'em uso' ? 'bg-primary' :
                                                chip.status === 'com problema' ? 'bg-warning text-dark' :
                                                chip.status === 'cancelado' ? 'bg-danger' :
                                                'bg-secondary'
                                            }`}>
                                                {chip.status}
                                            </span>
                                        </td>

                                        {/* AÇÕES APENAS PARA ADMIN */}
                                        {isAdmin && (
                                            <td className="text-center text-nowrap">

                                                {/* ⚠️ Problema  /  ✅ Resolver */}
                                                {chip.status === 'com problema' ? (
                                                    <button
                                                        onClick={() => handleResolver(chip)}
                                                        className="btn btn-sm btn-success me-2"
                                                    >
                                                        ✅ Resolver
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleMarcarProblema(chip)}
                                                        className="btn btn-sm btn-warning me-2"
                                                    >
                                                        ⚠️ Problema
                                                    </button>
                                                )}

                                                {/* ✏️ Editar */}
                                                <button
                                                    onClick={() => onEditar(chip)}
                                                    className="btn btn-sm btn-primary me-2"
                                                >
                                                    ✏️ Editar
                                                </button>

                                                {/* 🗑️ Deletar */}
                                                <button
                                                    onClick={() => handleDeletar(chip)}
                                                    className="btn btn-sm btn-danger"
                                                >
                                                    🗑️ Deletar
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

export default ChipLista;