import React, { useState, useEffect } from 'react';
import { entregaComputadorService } from '../services/api';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';


function HistoricoComputador() {
    
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [busca, setBusca] = useState('');
  const [tipoBusca, setTipoBusca] = useState('todos');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  const carregarHistorico = async () => {
    try {
      setLoading(true);
      const response = await entregaComputadorService.listarHistorico();
      setHistorico(response.data);
    } catch (error) {
      toast.error('Erro ao carregar histórico');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarHistorico();
  }, []);

  const historicoFiltrado = historico.filter(entrega => {
    if (filtroStatus === 'ativas' && !entrega.ativo) return false;
    if (filtroStatus === 'deletadas' && entrega.ativo) return false;

    if (busca) {
      const termo = busca.toLowerCase();
      if (tipoBusca === 'patrimonio') return entrega.computador?.numeroPatrimonio?.toLowerCase().includes(termo);
      if (tipoBusca === 'colaborador') return entrega.colaborador?.nome?.toLowerCase().includes(termo);
    }

    return true;
  });

  const totalPaginas = Math.ceil(historicoFiltrado.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const itensPagina = historicoFiltrado.slice(inicio, inicio + itensPorPagina);

  const mudarPagina = (pagina) => {
    if (pagina < 1 || pagina > totalPaginas) return;
    setPaginaAtual(pagina);
  };

  useEffect(() => {
    setPaginaAtual(1);
  }, [filtroStatus, busca, tipoBusca]);

  const formatarData = (data) => {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const getBadgeSituacao = (entrega) => {
    if (entrega.ativo) return <span className="badge bg-success">Ativa</span>;
    return <span className="badge bg-secondary">Realizada</span>;
  };

  const getBadgeStatusEntrega = (status) => {
    const cor = status === 'ativo' ? 'bg-success' :
                status === 'devolvido' ? 'bg-secondary' :
                'bg-danger';
    return <span className={`badge ${cor}`}>{status}</span>;
  };

  const exportarExcel = () => {
    if (historicoFiltrado.length === 0) {
      toast.warning('Nenhum dado para exportar!');
      return;
    }

    const dados = historicoFiltrado.map(entrega => ({
      'Patrimônio': entrega.computador?.numeroPatrimonio || '-',
      'Modelo': entrega.computador?.modelo || '-',
      'Registro': entrega.colaborador?.registro || '-',
      'Colaborador': entrega.colaborador?.nome || '-',
      'Departamento': entrega.departamento || '-',
      'Acessórios': entrega.acessorios || '-',
      'Data Entrega': formatarData(entrega.dataEntrega),
      'Status Entrega': entrega.status,
      'Situação': entrega.ativo ? 'Ativa' : 'Realizada'
    }));

    const ws = XLSX.utils.json_to_sheet(dados);

    ws['!cols'] = [
      { wch: 16 }, // Patrimônio
      { wch: 18 }, // Modelo
      { wch: 10 }, // Registro
      { wch: 22 }, // Colaborador
      { wch: 16 }, // Departamento
      { wch: 30 }, // Acessórios
      { wch: 14 }, // Data Entrega
      { wch: 14 }, // Status Entrega
      { wch: 12 }  // Situação
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Histórico Computadores');

    const nomeArquivo = `historico-entregas-computador-${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.xlsx`;
    XLSX.writeFile(wb, nomeArquivo);

    toast.success('✅ Excel exportado com sucesso!');
  };

  return (
    <div>
      <h2 className="mb-4">🕐 Histórico de Entregas — Computadores</h2>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <label className="form-label">Situação</label>
              <select className="form-select" value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
                <option value="todos">Todas</option>
                <option value="ativas">Apenas ativas</option>
                <option value="deletadas">Apenas realizadas</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Buscar por</label>
              <select className="form-select" value={tipoBusca} onChange={e => { setTipoBusca(e.target.value); setBusca(''); }}>
                <option value="todos">Sem filtro</option>
                <option value="patrimonio">Patrimônio</option>
                <option value="colaborador">Colaborador</option>
              </select>
            </div>
            {tipoBusca !== 'todos' && (
              <div className="col-md-4">
                <label className="form-label">{tipoBusca === 'patrimonio' ? 'Patrimônio' : 'Nome do Colaborador'}</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={tipoBusca === 'patrimonio' ? 'Digite o patrimônio...' : 'Digite o nome...'}
                  value={busca}
                  onChange={e => setBusca(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>Total: {historicoFiltrado.length} registros</span>
          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-outline-primary" onClick={carregarHistorico}>
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
          ) : historicoFiltrado.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <p>Nenhum registro encontrado</p>
            </div>
          ) : (
            <table className="table table-hover mb-0">
              <thead className="table-dark">
                <tr>
                  <th className="text-center">Patrimônio</th>
                  <th className="text-center">Modelo</th>
                  <th className="text-center">Registro</th>
                  <th className="text-center">Colaborador</th>
                  <th className="text-center">Departamento</th>
                  <th className="text-center">Acessórios</th>
                  <th className="text-center">Data Entrega</th>
                  <th className="text-center">Status Entrega</th>
                  <th className="text-center">Situação</th>
                </tr>
              </thead>
              <tbody>
                {itensPagina.map((entrega, index) => (
                  <tr key={index} className={`align-middle ${!entrega.ativo ? 'table-secondary' : ''}`}>
                    <td className="text-center"><code>{entrega.computador?.numeroPatrimonio || '-'}</code></td>
                    <td className="text-center">{entrega.computador?.modelo || '-'}</td>
                    <td className="text-center">{entrega.colaborador?.registro || '-'}</td>
                    <td className="text-center">{entrega.colaborador?.nome || '-'}</td>
                    <td className="text-center">{entrega.departamento || '-'}</td>
                    <td className="text-center">{entrega.acessorios || '-'}</td>
                    <td className="text-center">{formatarData(entrega.dataEntrega)}</td>
                    <td className="text-center">{getBadgeStatusEntrega(entrega.status)}</td>
                    <td className="text-center">{getBadgeSituacao(entrega)}</td>
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

export default HistoricoComputador;