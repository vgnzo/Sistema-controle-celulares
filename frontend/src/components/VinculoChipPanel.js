import React, { useState, useEffect } from 'react';
import { chipService, vinculoChipService } from '../services/api';
import { toast } from 'react-toastify';

// Painel para gerenciar o chip de UM celular específico (usado dentro da página de Celulares)
function VinculoChipPanel({ celular, onFechar }) {
    const [chips, setChips] = useState([]);
    const [chipAtual, setChipAtual] = useState(null);      // vínculo ativo (ou null)
    const [iccidParaVincular, setIccidParaVincular] = useState('');
    const [historico, setHistorico] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        chipService.listarTodos().then(r => setChips(r.data)).catch(() => {});
    }, []);

    useEffect(() => {
        if (celular?.imei) carregar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [celular]);

    const carregar = async () => {
        setLoading(true);
        try {
            const atual = await vinculoChipService.chipAtualDoCelular(celular.imei);
            // backend retorna o objeto vínculo OU uma string quando não há chip
            if (atual.data && typeof atual.data === 'object' && atual.data.chip) {
                setChipAtual(atual.data);
            } else {
                setChipAtual(null);
            }
            const hist = await vinculoChipService.historicoPorCelular(celular.imei);
            setHistorico(hist.data);
        } catch (e) {
            console.error(e);
            setChipAtual(null);
            setHistorico([]);
        } finally {
            setLoading(false);
        }
    };

    const handleVincular = async () => {
        if (!iccidParaVincular) { toast.warn('Selecione um chip'); return; }
        try {
            await vinculoChipService.vincular(iccidParaVincular, celular.imei);
            toast.success('✅ Chip vinculado!');
            setIccidParaVincular('');
            carregar();
        } catch (e) {
            toast.error(e.response?.data || '❌ Erro ao vincular');
        }
    };

    const handleDesvincular = async () => {
        if (window.confirm('Desvincular o chip deste celular?')) {
            try {
                await vinculoChipService.desvincular(celular.imei);
                toast.success('✅ Chip desvinculado!');
                carregar();
            } catch (e) {
                toast.error(e.response?.data || '❌ Erro ao desvincular');
            }
        }
    };

    const chipsDisponiveis = chips.filter(c => c.status === 'disponivel');

    return (
        <div className="card mb-4 border-primary">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">🔗 Chip do celular: {celular.modelo} ({celular.imei})</h5>
                <button className="btn btn-sm btn-outline-secondary" onClick={onFechar}>✖ Fechar</button>
            </div>
            <div className="card-body">
                {loading ? <div>Carregando...</div> : (
                    <>
                        {chipAtual ? (
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <strong>ICCID:</strong> {chipAtual.chip.iccid} <br />
                                    <strong>Operadora:</strong> {chipAtual.chip.operadora || '-'} <br />
                                    <strong>Linha:</strong> {chipAtual.chip.numeroLinha || '-'} <br />
                                    <strong>Vinculado em:</strong> {new Date(chipAtual.dataInicio).toLocaleDateString('pt-BR')}
                                </div>
                                <button className="btn btn-danger" onClick={handleDesvincular}>🔌 Desvincular</button>
                            </div>
                        ) : (
                            <div className="mb-3">
                                <p className="text-muted">Esse celular não tem chip vinculado no momento.</p>
                                <div className="d-flex gap-2 align-items-end">
                                    <div style={{ flex: 1 }}>
                                        <label className="form-label">Escolher chip disponível</label>
                                        <select
                                            className="form-select"
                                            value={iccidParaVincular}
                                            onChange={(e) => setIccidParaVincular(e.target.value)}
                                        >
                                            <option value="">Selecione um chip...</option>
                                            {chipsDisponiveis.map(chip => (
                                                <option key={chip.iccid} value={chip.iccid}>
                                                    {chip.iccid} {chip.operadora ? `(${chip.operadora})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button className="btn btn-success" onClick={handleVincular}>🔗 Vincular</button>
                                </div>
                                {chipsDisponiveis.length === 0 && (
                                    <small className="text-muted d-block mt-2">
                                        Nenhum chip disponível. Cadastre um na aba Chips.
                                    </small>
                                )}
                            </div>
                        )}

                        {historico.length > 0 && (
                            <div>
                                <h6>📜 Histórico</h6>
                                <div className="table-responsive">
                                    <table className="table table-sm table-striped">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>ICCID</th>
                                                <th>Operadora</th>
                                                <th>Início</th>
                                                <th>Fim</th>
                                                <th>Situação</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {historico.map(v => (
                                                <tr key={v.id}>
                                                    <td>{v.chip?.iccid}</td>
                                                    <td>{v.chip?.operadora || '-'}</td>
                                                    <td>{new Date(v.dataInicio).toLocaleDateString('pt-BR')}</td>
                                                    <td>{v.dataFim ? new Date(v.dataFim).toLocaleDateString('pt-BR') : '-'}</td>
                                                    <td>
                                                        {v.dataFim
                                                            ? <span className="badge bg-secondary">Encerrado</span>
                                                            : <span className="badge bg-success">Ativo</span>}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default VinculoChipPanel;