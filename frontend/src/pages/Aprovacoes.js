import React, { useState, useEffect } from 'react';
import { passagemService, hotelService } from '../services/api';
import { toast } from 'react-toastify';

function Aprovacoes() {
    const [passagens, setPassagens] = useState([]);
    const [hoteis, setHoteis] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalAberto, setModalAberto] = useState(false);
    const [tipoModal, setTipoModal] = useState(null); // 'aprovar-passagem' | 'aprovar-hotel' | 'rejeitar'
    const [itemSelecionado, setItemSelecionado] = useState(null);
    const [observacao, setObservacao] = useState('');

    // campos extras preenchidos pelo admin na aprovação
    const [dadosAprovacao, setDadosAprovacao] = useState({
        localEmbarque: '',
        localEmbarqueVolta: '',
        dataIda: '',
        dataVolta: '',
        valor: '',
        dataEntrada: '',
        dataSaida: '',
    });

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

    const abrirModalAprovar = (tipo, item) => {
        setTipoModal(tipo === 'passagem' ? 'aprovar-passagem' : 'aprovar-hotel');
        setItemSelecionado(item);
setDadosAprovacao({ localEmbarque: '', localEmbarqueVolta: '', dataIda: '', dataVolta: '', valor: '', dataEntrada: '', dataSaida: '' });        setModalAberto(true);
    };

    const abrirModalRejeitar = (tipo, id) => {
        setTipoModal('rejeitar');
        setItemSelecionado({ tipo, id });
        setObservacao('');
        setModalAberto(true);
    };

    const handleConfirmarAprovacao = async () => {
        try {
            if (tipoModal === 'aprovar-passagem') {
                // atualiza os dados extras antes de aprovar
               await passagemService.atualizar(itemSelecionado.id, {
                    solicitanteNome: itemSelecionado.solicitanteNome,
                    solicitanteRegistro: itemSelecionado.solicitanteRegistro,
                    destino: itemSelecionado.destino,
                    motivo: itemSelecionado.motivo,
                    localEmbarque: dadosAprovacao.localEmbarque,
                    localEmbarqueVolta: dadosAprovacao.localEmbarqueVolta,
                    dataIda: dadosAprovacao.dataIda || null,
                    dataVolta: dadosAprovacao.dataVolta || null,
                    valor: dadosAprovacao.valor ? Number(dadosAprovacao.valor) : null,
                });
                await passagemService.aprovar(itemSelecionado.id);
                toast.success('✅ Passagem aprovada!');
            } else {
                await hotelService.atualizar(itemSelecionado.id, {
                    solicitanteNome: itemSelecionado.solicitanteNome,
                    solicitanteRegistro: itemSelecionado.solicitanteRegistro,
                    motivo: itemSelecionado.motivo,
                    dataEntrada: dadosAprovacao.dataEntrada || null,
                    dataSaida: dadosAprovacao.dataSaida || null,
                    valor: dadosAprovacao.valor ? Number(dadosAprovacao.valor) : null,
                });
                await hotelService.aprovar(itemSelecionado.id);
                toast.success('✅ Reserva aprovada!');
            }
            setModalAberto(false);
            carregarPendentes();
        } catch (error) {
            toast.error(error.response?.data || '❌ Erro ao aprovar');
        }
    };

    const handleConfirmarRejeicao = async () => {
        try {
            if (itemSelecionado.tipo === 'passagem') {
                await passagemService.rejeitar(itemSelecionado.id, observacao);
                toast.success('Passagem rejeitada');
            } else {
                await hotelService.rejeitar(itemSelecionado.id, observacao);
                toast.success('Reserva rejeitada');
            }
            setModalAberto(false);
            carregarPendentes();
        } catch (error) {
            toast.error(error.response?.data || '❌ Erro ao rejeitar');
        }
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
                <div className="alert alert-success">✅ Nenhuma solicitação pendente!</div>
            )}

            {/* PASSAGENS */}
            {passagens.length > 0 && (
                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="mb-0">✈️ Passagens Pendentes <span className="badge bg-warning text-dark ms-2">{passagens.length}</span></h5>
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
                                        <th className="text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {passagens.map((p) => (
                                       <tr key={p.id}>
                                            <td>{p.solicitanteNome || '-'}</td>
                                            <td>{p.solicitanteRegistro || '-'}</td>
                                            <td>{p.destino}</td>
                                            <td>{p.motivo || '-'}</td>
                                            <td className="text-center text-nowrap">
                                                <button onClick={() => abrirModalAprovar('passagem', p)} className="btn btn-sm btn-success me-2">✅ Aprovar</button>
                                                <button onClick={() => abrirModalRejeitar('passagem', p.id)} className="btn btn-sm btn-danger">❌ Rejeitar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* HOTÉIS */}
            {hoteis.length > 0 && (
                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="mb-0">🏨 Reservas Pendentes <span className="badge bg-warning text-dark ms-2">{hoteis.length}</span></h5>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Solicitante</th>
                                        <th>Registro</th>
                                        <th>Motivo</th>
                                        <th className="text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {hoteis.map((h) => (
                                     <tr key={h.id}>
                                            <td>{h.solicitanteNome || '-'}</td>
                                            <td>{h.solicitanteRegistro || '-'}</td>
                                            <td>{h.motivo || '-'}</td>
                                            <td className="text-center text-nowrap">
                                                <button onClick={() => abrirModalAprovar('hotel', h)} className="btn btn-sm btn-success me-2">✅ Aprovar</button>
                                                <button onClick={() => abrirModalRejeitar('hotel', h.id)} className="btn btn-sm btn-danger">❌ Rejeitar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL */}
            {modalAberto && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {tipoModal === 'rejeitar' ? '❌ Rejeitar Solicitação' : '✅ Aprovar Solicitação'}
                                </h5>
                                <button className="btn-close" onClick={() => setModalAberto(false)} />
                            </div>

                            <div className="modal-body">
                                {/* MODAL APROVAR PASSAGEM */}
                               {tipoModal === 'aprovar-passagem' && (
                                    <>
                                        <div className="mb-3">
                                            <label className="form-label">Local de Embarque (Ida)</label>
                                            <input type="text" className="form-control" placeholder="Ex: Aeroporto de Guarulhos"
                                                value={dadosAprovacao.localEmbarque}
                                                onChange={e => setDadosAprovacao({ ...dadosAprovacao, localEmbarque: e.target.value })} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Local de Embarque (Volta)</label>
                                            <input type="text" className="form-control" placeholder="Ex: Aeroporto de Congonhas"
                                                value={dadosAprovacao.localEmbarqueVolta}
                                                onChange={e => setDadosAprovacao({ ...dadosAprovacao, localEmbarqueVolta: e.target.value })} />
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Data de Ida *</label>
                                                <input type="date" className="form-control" required
                                                    value={dadosAprovacao.dataIda}
                                                    onChange={e => setDadosAprovacao({ ...dadosAprovacao, dataIda: e.target.value })} />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Data de Volta</label>
                                                <input type="date" className="form-control"
                                                    value={dadosAprovacao.dataVolta}
                                                    onChange={e => setDadosAprovacao({ ...dadosAprovacao, dataVolta: e.target.value })} />
                                                <small className="text-muted">Deixe vazio se for só ida</small>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* MODAL APROVAR HOTEL */}
                               {tipoModal === 'aprovar-hotel' && (
                                    <>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Data de Entrada *</label>
                                                <input type="date" className="form-control" required
                                                    value={dadosAprovacao.dataEntrada}
                                                    onChange={e => setDadosAprovacao({ ...dadosAprovacao, dataEntrada: e.target.value })} />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Data de Saída *</label>
                                                <input type="date" className="form-control" required
                                                    value={dadosAprovacao.dataSaida}
                                                    onChange={e => setDadosAprovacao({ ...dadosAprovacao, dataSaida: e.target.value })} />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* MODAL REJEITAR */}
                                {tipoModal === 'rejeitar' && (
                                    <>
                                        <label className="form-label">Motivo da rejeição <span className="text-muted">(opcional)</span></label>
                                        <input type="text" className="form-control"
                                            placeholder="Ex: Orçamento excedido..."
                                            value={observacao}
                                            onChange={e => setObservacao(e.target.value)}
                                            autoFocus />
                                    </>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setModalAberto(false)}>Cancelar</button>
                                {tipoModal === 'rejeitar' ? (
                                    <button className="btn btn-danger" onClick={handleConfirmarRejeicao}>❌ Confirmar Rejeição</button>
                                ) : (
                                    <button className="btn btn-success" onClick={handleConfirmarAprovacao}>✅ Confirmar Aprovação</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Aprovacoes;