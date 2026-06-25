import React, { useState, useEffect } from 'react';
import { passagemService, hotelService } from '../services/api';

function MeusPedidos() {
    const [passagens, setPassagens] = useState([]);
    const [hoteis, setHoteis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        carregarMeusPedidos();
    }, []);

    const carregarMeusPedidos = async () => {
        try {
            setLoading(true);
            const [resPassagens, resHoteis] = await Promise.all([
                passagemService.listarMeus(),
                hotelService.listarMeus()
            ]);
            setPassagens(resPassagens.data);
            setHoteis(resHoteis.data);
            setErro(null);
        } catch (error) {
            setErro('Erro ao carregar seus pedidos');
        } finally {
            setLoading(false);
        }
    };

    // badge colorido do status
    const badgeStatus = (status) => {
        switch (status) {
            case 'APROVADO': return <span className="badge bg-success">✅ Aprovado</span>;
            case 'REJEITADO': return <span className="badge bg-danger">❌ Rejeitado</span>;
            default: return <span className="badge bg-warning text-dark">⏳ Pendente</span>;
        }
    };

    // formata data (2026-07-10 -> 10/07/2026)
    const formatarData = (data) => {
        if (!data) return '-';
        return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
    };

    if (loading) return (
        <div className="text-center mt-5">
            <div className="spinner-border text-primary"></div>
            <p className="mt-2">Carregando seus pedidos...</p>
        </div>
    );

    if (erro) return <div className="alert alert-danger">{erro}</div>;

    const semPedidos = passagens.length === 0 && hoteis.length === 0;

    return (
        <div>
            <h2 className="mb-4">📋 Meus Pedidos</h2>

            {semPedidos && (
                <div className="alert alert-info">
                    Você ainda não fez nenhum pedido de passagem ou hotel.
                </div>
            )}

            {/* PASSAGENS */}
            {passagens.length > 0 && (
                <>
                    <h5 className="text-muted mb-3">✈️ Minhas Passagens</h5>
                    <div className="row g-3 mb-4">
                        {passagens.map((p) => (
                            <div className="col-md-6" key={p.id}>
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h5 className="mb-0">✈️ {p.destino}</h5>
                                            {badgeStatus(p.status)}
                                        </div>
                                        <p className="text-muted mb-2">
                                            <strong>Solicitante:</strong> {p.solicitanteNome || '-'} ({p.solicitanteRegistro || '-'})
                                        </p>
                                        {p.motivo && <p className="mb-2"><strong>Motivo:</strong> {p.motivo}</p>}

                                        {/* detalhes só aparecem se foi aprovado e preenchido */}
                                        {p.status === 'APROVADO' && (
                                            <div className="mt-3 pt-3 border-top">
                                                <p className="mb-1"><strong>✈️ Companhia:</strong> {p.companhiaAerea || '-'}</p>
                                                <p className="mb-1"><strong>📅 Ida:</strong> {formatarData(p.dataIda)}</p>
                                                <p className="mb-1"><strong>📅 Volta:</strong> {p.dataVolta ? formatarData(p.dataVolta) : 'Só ida'}</p>
                                                <p className="mb-1"><strong>🛫 Embarque (Ida):</strong> {p.localEmbarque || '-'}</p>
                                                <p className="mb-0"><strong>🛬 Embarque (Volta):</strong> {p.localEmbarqueVolta || '-'}</p>
                                            </div>
                                        )}

                                        {/* se rejeitado, mostra o motivo */}
                                        {p.status === 'REJEITADO' && p.observacao && (
                                            <div className="mt-3 pt-3 border-top">
                                                <p className="mb-0 text-danger"><strong>Motivo da recusa:</strong> {p.observacao}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* HOTÉIS */}
            {hoteis.length > 0 && (
                <>
                    <h5 className="text-muted mb-3">🏨 Minhas Reservas de Hotel</h5>
                    <div className="row g-3 mb-4">
                        {hoteis.map((h) => (
                            <div className="col-md-6" key={h.id}>
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h5 className="mb-0">🏨 Reserva</h5>
                                            {badgeStatus(h.status)}
                                        </div>
                                        <p className="text-muted mb-2">
                                            <strong>Solicitante:</strong> {h.solicitanteNome || '-'} ({h.solicitanteRegistro || '-'})
                                        </p>
                                        {h.motivo && <p className="mb-2"><strong>Motivo:</strong> {h.motivo}</p>}

                                       {h.status === 'APROVADO' && (
                                            <div className="mt-3 pt-3 border-top">
                                                <p className="mb-1"><strong>🏨 Hotel:</strong> {h.nomeHotel || '-'}</p>
                                                <p className="mb-1"><strong>📅 Entrada:</strong> {formatarData(h.dataEntrada)}</p>
                                                <p className="mb-0"><strong>📅 Saída:</strong> {formatarData(h.dataSaida)}</p>
                                            </div>
                                        )}

                                        {h.status === 'REJEITADO' && h.observacao && (
                                            <div className="mt-3 pt-3 border-top">
                                                <p className="mb-0 text-danger"><strong>Motivo da recusa:</strong> {h.observacao}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default MeusPedidos;