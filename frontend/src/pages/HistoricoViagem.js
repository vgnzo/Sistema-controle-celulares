import React, { useState, useEffect } from 'react';
import { passagemService, hotelService } from '../services/api';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

function HistoricoViagem() {
    const [passagens, setPassagens] = useState([]);
    const [hoteis, setHoteis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [aba, setAba] = useState('passagens'); // 'passagens' ou 'hoteis'
    const [filtroStatus, setFiltroStatus] = useState('todos');
    const [busca, setBusca] = useState('');
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 10;

    const carregarDados = async () => {
        try {
            setLoading(true);
            const [resP, resH] = await Promise.all([
                passagemService.listarTodas(),
                hotelService.listarTodas()
            ]);
            setPassagens(resP.data);
            setHoteis(resH.data);
        } catch (error) {
            toast.error('Erro ao carregar histórico');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarDados();
    }, []);

    useEffect(() => {
        setPaginaAtual(1);
    }, [filtroStatus, busca, aba]);

    const formatarData = (data) => {
        if (!data) return '-';
        return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
    };


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

    // filtra a lista da aba atual
    const dadosFiltrados = (aba === 'passagens' ? passagens : hoteis).filter(item => {
        if (filtroStatus !== 'todos' && item.status !== filtroStatus) return false;
        if (busca) {
            const termo = busca.toLowerCase();
            return item.colaborador?.nome?.toLowerCase().includes(termo);
        }
        return true;
    });

    const totalPaginas = Math.ceil(dadosFiltrados.length / itensPorPagina);
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const itensPagina = dadosFiltrados.slice(inicio, inicio + itensPorPagina);

    const mudarPagina = (pagina) => {
        if (pagina < 1 || pagina > totalPaginas) return;
        setPaginaAtual(pagina);
    };

    const exportarExcel = () => {
        if (dadosFiltrados.length === 0) {
            toast.warning('Nenhum dado para exportar!');
            return;
        }

        let dados;
        if (aba === 'passagens') {
            dados = dadosFiltrados.map(p => ({
                'Colaborador': p.colaborador?.nome || '-',
                'Destino': p.destino || '-',
                'Embarque': p.localEmbarque || '-',
                'Data Ida': formatarData(p.dataIda),
                'Data Volta': p.dataVolta ? formatarData(p.dataVolta) : 'Só ida',
                'Motivo': p.motivo || '-',
                'Status': p.status,
                'Observação': p.observacao || '-'
            }));
        } else {
            dados = dadosFiltrados.map(h => ({
                'Colaborador': h.colaborador?.nome || '-',
                'Entrada': formatarData(h.dataEntrada),
                'Saída': formatarData(h.dataSaida),
                'Motivo': h.motivo || '-',
                'Valor': formatarValor(h.valor),
                'Status': h.status,
                'Observação': h.observacao || '-'
            }));
        }

        const ws = XLSX.utils.json_to_sheet(dados);
        ws['!cols'] = Object.keys(dados[0]).map(() => ({ wch: 20 }));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, aba === 'passagens' ? 'Passagens' : 'Hotéis');
        const nomeArquivo = `historico-${aba}-${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.xlsx`;
        XLSX.writeFile(wb, nomeArquivo);
        toast.success('✅ Excel exportado com sucesso!');
    };

    return (
        <div>
            <h2 className="mb-4">🕐 Histórico de Viagens</h2>

            {/* Abas passagens / hotéis */}
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button
                        className={`nav-link ${aba === 'passagens' ? 'active' : ''}`}
                        onClick={() => setAba('passagens')}
                    >
                        ✈️ Passagens
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${aba === 'hoteis' ? 'active' : ''}`}
                        onClick={() => setAba('hoteis')}
                    >
                        🏨 Hotéis
                    </button>
                </li>
            </ul>

            {/* Filtros */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row g-3 align-items-end">
                        <div className="col-md-3">
                            <label className="form-label">Status</label>
                            <select
                                className="form-select"
                                value={filtroStatus}
                                onChange={e => setFiltroStatus(e.target.value)}
                            >
                                <option value="todos">Todos</option>
                                <option value="PENDENTE">⏳ Pendente</option>
                                <option value="APROVADO">✅ Aprovado</option>
                                <option value="REJEITADO">❌ Rejeitado</option>
                            </select>
                        </div>
                        <div className="col-md-5">
                            <label className="form-label">Buscar por colaborador</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Digite o nome do colaborador..."
                                value={busca}
                                onChange={e => setBusca(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabela */}
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <span>Total: {dadosFiltrados.length} registros</span>
                    <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-primary" onClick={carregarDados}>
                            🔄 Atualizar
                        </button>
                        <button className="btn btn-sm btn-success" onClick={exportarExcel}>
                            📥 Exportar Excel
                        </button>
                    </div>
                </div>

                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary"></div>
                            <p className="mt-2">Carregando...</p>
                        </div>
                    ) : dadosFiltrados.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <p>Nenhum registro encontrado</p>
                        </div>
                    ) : aba === 'passagens' ? (
                        <table className="table table-hover mb-0">
                            <thead className="table-dark">
                                <tr>
                                    <th>Colaborador</th>
                                    <th>Destino</th>
                                    <th>Embarque</th>
                                    <th>Ida</th>
                                    <th>Volta</th>
                                    <th>Motivo</th>
                                    <th>Status</th>
                                    <th>Observação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itensPagina.map((p) => (
                                    <tr key={p.id} className="align-middle">
                                        <td>{p.colaborador?.nome || '-'}</td>
                                        <td>{p.destino}</td>
                                        <td>{p.localEmbarque || '-'}</td>
                                        <td>{formatarData(p.dataIda)}</td>
                                        <td>{p.dataVolta ? formatarData(p.dataVolta) : '🔂 Só ida'}</td>
                                        <td>{p.motivo || '-'}</td>
                                        <td>{badgeStatus(p.status)}</td>
                                        <td>{p.observacao || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <table className="table table-hover mb-0">
                            <thead className="table-dark">
                                <tr>
                                    <th>Colaborador</th>
                                    <th>Entrada</th>
                                    <th>Saída</th>
                                    <th>Motivo</th>
                                    <th>Status</th>
                                    <th>Observação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itensPagina.map((h) => (
                                    <tr key={h.id} className="align-middle">
                                        <td>{h.colaborador?.nome || '-'}</td>
                                        <td>{formatarData(h.dataEntrada)}</td>
                                        <td>{formatarData(h.dataSaida)}</td>
                                        <td>{h.motivo || '-'}</td>
                                        <td>{formatarValor(h.valor)}</td>
                                        <td>{badgeStatus(h.status)}</td>
                                        <td>{h.observacao || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {totalPaginas > 1 && (
                    <div className="card-footer d-flex justify-content-between align-items-center">
                        <small className="text-muted">Página {paginaAtual} de {totalPaginas}</small>
                        <ul className="pagination pagination-sm mb-0">
                            <li className={`page-item ${paginaAtual === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => mudarPagina(paginaAtual - 1)}>Anterior</button>
                            </li>
                            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(pagina => (
                                <li key={pagina} className={`page-item ${paginaAtual === pagina ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => mudarPagina(pagina)}>{pagina}</button>
                                </li>
                            ))}
                            <li className={`page-item ${paginaAtual === totalPaginas ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => mudarPagina(paginaAtual + 1)}>Próximo</button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HistoricoViagem;