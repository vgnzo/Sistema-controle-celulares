import React, { useState, useEffect } from 'react';
import { entregaService } from '../services/api';
import { toast } from 'react-toastify';

function Historico() {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [busca, setBusca] = useState('');
  const [tipoBusca, setTipoBusca] = useState('todos');

  const carregarHistorico = async () => {
    try {
      setLoading(true);
      const response = await entregaService.listarHistorico();
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
      if (tipoBusca === 'imei') return entrega.id.imei.includes(termo);
      if (tipoBusca === 'colaborador') return entrega.colaborador?.nome.toLowerCase().includes(termo);
    }

    return true;
  });

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

  const getBadgeStatusCelular = (status) => {
    const cor = status === 'em estoque' ? 'bg-success' :
                status === 'entregue' ? 'bg-primary' :
                status === 'manutencao' ? 'bg-warning text-dark' :
                status === 'baixado' ? 'bg-danger' :
                'bg-secondary';
    return <span className={`badge ${cor}`}>{status || '-'}</span>;
  };

  // Exportar CSV
  const exportarCSV = () => {
    if (historicoFiltrado.length === 0) {
      toast.warning('Nenhum dado para exportar!');
      return;
    }

    const cabecalho = [
      'IMEI',
      'Colaborador',
      'Departamento',
      'Status Colaborador',
      'Status Celular',
      'Data Entrega',
      'Prev. Devolução',
      'Status Entrega',
      'Situação'
    ];

    const linhas = historicoFiltrado.map(entrega => [
      entrega.id.imei,
      entrega.colaborador?.nome || '-',
      entrega.colaborador?.departamento || '-',
      entrega.colaborador?.status || '-',
      entrega.celular?.status || '-',
      formatarData(entrega.dataEntrega),
      formatarData(entrega.dataPrevistaDevolucao),
      entrega.status,
      entrega.ativo ? 'Ativa' : 'Realizada'
    ]);

    const csvConteudo = [cabecalho, ...linhas]
      .map(linha => linha.join(';'))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvConteudo], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `historico-entregas-${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success('✅ CSV exportado com sucesso!');
  };

  return (
    <div>
      <h2 className="mb-4">🕐 Histórico de Entregas</h2>

      {/* Filtros */}
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
                <option value="imei">IMEI</option>
                <option value="colaborador">Colaborador</option>
              </select>
            </div>

            {tipoBusca !== 'todos' && (
              <div className="col-md-4">
                <label className="form-label">{tipoBusca === 'imei' ? 'IMEI' : 'Nome do Colaborador'}</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={tipoBusca === 'imei' ? 'Digite o IMEI...' : 'Digite o nome...'}
                  value={busca}
                  onChange={e => setBusca(e.target.value)}
                />
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>Total: {historicoFiltrado.length} registros</span>
          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-outline-primary" onClick={carregarHistorico}>
              🔄 Atualizar
            </button>
            <button className="btn btn-sm btn-success" onClick={exportarCSV}>
              📥 Exportar CSV
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
                  <th className="text-center">IMEI</th>
                  <th className="text-center">Colaborador</th>
                  <th className="text-center">Departamento</th>
                  <th className="text-center">Status Colaborador</th>
                  <th className="text-center">Status Celular</th>
                  <th className="text-center">Data Entrega</th>
                  <th className="text-center">Prev. Devolução</th>
                  <th className="text-center">Status Entrega</th>
                  <th className="text-center">Situação Devolução</th>
                </tr>
              </thead>
              <tbody>
                {historicoFiltrado.map((entrega, index) => (
                  <tr key={index} className={`align-middle ${!entrega.ativo ? 'table-secondary' : ''}`}>
                    <td className="text-center"><code>{entrega.id.imei}</code></td>
                    <td className="text-center">{entrega.colaborador?.nome || '-'}</td>
                    <td className="text-center">{entrega.colaborador?.departamento || '-'}</td>
                    <td className="text-center">
                      <span className={`badge ${entrega.colaborador?.status === 'ativo' ? 'bg-success' : 'bg-secondary'}`}>
                        {entrega.colaborador?.status || '-'}
                      </span>
                    </td>
                    <td className="text-center">{getBadgeStatusCelular(entrega.celular?.status)}</td>
                    <td className="text-center">{formatarData(entrega.dataEntrega)}</td>
                    <td className="text-center">{formatarData(entrega.dataPrevistaDevolucao)}</td>
                    <td className="text-center">{getBadgeStatusEntrega(entrega.status)}</td>
                    <td className="text-center">{getBadgeSituacao(entrega)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Historico;