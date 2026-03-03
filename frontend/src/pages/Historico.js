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

  // ✅ badge Situação Entrega
const getBadgeSituacao = (entrega) => {
    if (entrega.ativo) return <span className="badge bg-success">Ativa</span>;
    return <span className="badge bg-secondary">Realizada</span>; // ✅ era "Deletada"
};

  // ✅ badge Status Entrega
  const getBadgeStatusEntrega = (status) => {
    const cor = status === 'ativo' ? 'bg-success' :
                status === 'devolvido' ? 'bg-secondary' :
                'bg-danger';
    return <span className={`badge ${cor}`}>{status}</span>;
  };

  // ✅ badge Status Celular
  const getBadgeStatusCelular = (status) => {
    const cor = status === 'em estoque' ? 'bg-success' :
                status === 'entregue' ? 'bg-primary' :
                status === 'manutencao' ? 'bg-warning text-dark' :
                status === 'baixado' ? 'bg-danger' :
                'bg-secondary';
    return <span className={`badge ${cor}`}>{status || '-'}</span>;
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
          <button className="btn btn-sm btn-outline-primary" onClick={carregarHistorico}>
            🔄 Atualizar
          </button>
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
                  <th>IMEI</th>
                  <th>Colaborador</th>
                  <th>Departamento</th>
                  <th>Status Colaborador</th>
                  <th>Status Celular</th>
                  <th>Data de Entrega</th>
                  <th>Prev. Devolução</th>
                  <th>Status da Entrega</th> 
                  <th>Situação da Devolução</th>
                </tr>
              </thead>
              <tbody>
                {historicoFiltrado.map((entrega, index) => (
                  <tr key={index} className={`align-middle ${!entrega.ativo ? 'table-secondary' : ''}`}>
                    <td><code>{entrega.id.imei}</code></td>
                    <td>{entrega.colaborador?.nome || '-'}</td>
                    <td>{entrega.colaborador?.departamento || '-'}</td>
                    <td>
                      <span className={`badge ${entrega.colaborador?.status === 'ativo' ? 'bg-success' : 'bg-secondary'}`}>
                        {entrega.colaborador?.status || '-'}
                      </span>
                    </td>
                    <td>{getBadgeStatusCelular(entrega.celular?.status)}</td> 
                    <td>{formatarData(entrega.dataEntrega)}</td>
                    <td>{formatarData(entrega.dataPrevistaDevolucao)}</td>
                    <td>{getBadgeStatusEntrega(entrega.status)}</td>           
                             <td>{getBadgeSituacao(entrega)}</td> 
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