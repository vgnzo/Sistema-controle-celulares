import React, { useState, useEffect } from 'react';
import { passagemService, hotelService } from '../services/api';
import { toast } from 'react-toastify';

function Aprovacoes() {
    const [passagens, setPassagens] = useState([]);
    const [hoteis, setHoteis] = useState([]);
    const [loading, setLoading] = useState(true);

    // controla o modal de rejeição
    const [modalAberto, setModalAberto] = useState(false);
    const [itemRejeitar, setItemRejeitar] = useState(null); // { tipo: 'passagem'|'hotel', id }
    const [observacao, setObservacao] = useState('');

    useEffect(() => {
        carregarPendentes();
    }, []);

    const carregarPendentes = async () => {
        try {
            setLoading(true);
            const [resPassagens, resHoteis] = await Promise.all([
                passagemService.listarPendentes(),
                hotelService.listarPendentes()
            ]);
            setPassagens(resPassagens.data);
            setHoteis(resHoteis.data);
        } catch (error) {
            toast.error('Erro ao carregar solicitações pendentes');
        } finally {
            setLoading(false);
        }
    };

    const handleAprovarPassagem = async (id) => {
        try {
            await passagemService.aprovar(id);
            toast.success('✅ Passagem aprovada!');
            carregarPendentes();
        } catch (error) {
            toast.error(error.response?.data || '❌ Erro ao aprovar');
        }
    };

    const handleAprovarHotel = async (id) => {
        try {
            await hotelService.aprovar(id);
            toast.success('✅ Reserva aprovada!');
            carregarPendentes();
        } catch (error) {
            toast.error(error.response?.data || '❌ Erro ao aprovar');
        }
    };

    // abre o modal e guarda qual item vai rejeitar
    const abrirModalRejeitar = (tipo, id) => {
        setItemRejeitar({ tipo, id });
        setObservacao('');
        setModalAberto(true);
    };

    const handleConfirmarRejeicao = async () => {
        if (!itemRejeitar) return;
        try {
            if (itemRejeitar.tipo === 'passagem') {
                await passagemService.rejeitar(itemRejeitar.id, observacao);
                toast.success('❌ Passagem rejeitada');
            } else {
                await hotelService.rejeitar(itemRejeitar.id, observacao);
                toast.success('❌ Reserva rejeitada');
            }
            setModalAberto(false);
            setItemRejeitar(null);
            carregarPendentes();
        } catch (error) {
            toast.error(error.response?.data || '❌ Erro ao rejeitar');
        }
    };

    const formatarData = (data) => {
        if (!data) return '-';
        return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
    };

    const formatarValor = (valor) => {
        if (valor === null || valor === undefined) return '-';
        return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    if (loading) return <div>Carregando...</div>;

    const totalPendentes = passagens.length + hoteis.length;

    return (
        <div>
            <div className="d-flex align-items-center mb-4">
                <h2 className="mb-0">⏳ Aprovações</h2>
                {totalPendentes > 0 && (
                    <span className="badge bg-warning text-dark ms-3 fs-6">
                        {totalPendentes} pendente{totalPendentes > 1 ? 's' : ''}
                    </span>
                )}
            </div>

            {totalPendentes === 0 && (
                <div className="alert alert-success">
                    ✅ Nenhuma solicitação pendente no momento!
                </div>
            )}

            {/* ===== PASSAGENS PENDENTES ===== */}
            {passagens.length > 0 && (
                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="mb-0">
                            ✈️ Passagens Pendentes
                            <span className="badge bg-warning text-dark ms-2">{passagens.length}</span>
                        </h5>
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
                                        <th className="text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {passagens.map((p) => (
                                        <tr key={p.id}>
                                            <td>{p.colaborador?.nome || '-'}</td>
                                            <td>{p.destino}</td>
                                            <td>{p.localEmbarque || '-'}</td>
                                            <td>{formatarData(p.dataIda)}</td>
                                            <td>{p.dataVolta ? formatarData(p.dataVolta) : '🔂 Só ida'}</td>
                                            <td>{p.motivo || '-'}</td>
                                            <td>{formatarValor(p.valor)}</td>
                                            <td className="text-center text-nowrap">
                                                <button
                                                    onClick={() => handleAprovarPassagem(p.id)}
                                                    className="btn btn-sm btn-success me-2"
                                                >
                                                    ✅ Aprovar
                                                </button>
                                                <button
                                                    onClick={() => abrirModalRejeitar('passagem', p.id)}
                                                    className="btn btn-sm btn-danger"
                                                >
                                                    ❌ Rejeitar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== HOTÉIS PENDENTES ===== */}
            {hoteis.length > 0 && (
                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="mb-0">
                            🏨 Reservas de Hotel Pendentes
                            <span className="badge bg-warning text-dark ms-2">{hoteis.length}</span>
                        </h5>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Colaborador</th>
                                        <th>Entrada</th>
                                        <th>Saída</th>
                                        <th>Motivo</th>
                                        <th>Valor</th>
                                        <th className="text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {hoteis.map((h) => (
                                        <tr key={h.id}>
                                            <td>{h.colaborador?.nome || '-'}</td>
                                            <td>{formatarData(h.dataEntrada)}</td>
                                            <td>{formatarData(h.dataSaida)}</td>
                                            <td>{h.motivo || '-'}</td>
                                            <td>{formatarValor(h.valor)}</td>
                                            <td className="text-center text-nowrap">
                                                <button
                                                    onClick={() => handleAprovarHotel(h.id)}
                                                    className="btn btn-sm btn-success me-2"
                                                >
                                                    ✅ Aprovar
                                                </button>
                                                <button
                                                    onClick={() => abrirModalRejeitar('hotel', h.id)}
                                                    className="btn btn-sm btn-danger"
                                                >
                                                    ❌ Rejeitar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== MODAL DE REJEIÇÃO ===== */}
            {modalAberto && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">❌ Rejeitar Solicitação</h5>
                                <button
                                    className="btn-close"
                                    onClick={() => setModalAberto(false)}
                                />
                            </div>
                            <div className="modal-body">
                                <label className="form-label">
                                    Motivo da rejeição <span className="text-muted">(opcional)</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ex: Orçamento excedido, datas indisponíveis..."
                                    value={observacao}
                                    onChange={(e) => setObservacao(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setModalAberto(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={handleConfirmarRejeicao}
                                >
                                    ❌ Confirmar Rejeição
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Aprovacoes;