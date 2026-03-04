import React, { useState, useEffect } from 'react';
import { celularService, colaboradorService, entregaService } from '../services/api';

function Dashboard() {
  const [celulares, setCelulares] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [resCelulares, resColaboradores, resEntregas] = await Promise.all([
        celularService.listarTodos(),
        colaboradorService.listarTodos(),
        entregaService.listarTodas()
      ]);
      setCelulares(resCelulares.data);
      setColaboradores(resColaboradores.data);
      setEntregas(resEntregas.data);
    } catch (error) {
      console.error('Erro ao carregar dashboard', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="text-center mt-5">
      <div className="spinner-border text-primary"></div>
      <p className="mt-2">Carregando...</p>
    </div>
  );

  const totalCelulares = celulares.length;
  const emEstoque = celulares.filter(c => c.status === 'em estoque').length;
  const entregues = celulares.filter(c => c.status === 'entregue').length;
  const emManutencao = celulares.filter(c => c.status === 'manutencao').length;
  const baixados = celulares.filter(c => c.status === 'baixado').length;

  const totalColaboradores = colaboradores.length;
  const colaboradoresAtivos = colaboradores.filter(c => c.status === 'ativo').length;
  const colaboradoresInativos = colaboradores.filter(c => c.status === 'inativo').length;

  const totalEntregas = entregas.length;
  const entregasAtivas = entregas.filter(e => e.status === 'ativo').length;
  const entregasAtrasadas = entregas.filter(e => e.status === 'atrasado').length;
  const entregasDevolvidas = entregas.filter(e => e.status === 'devolvido').length;

  return (
    <div>
      <h2 className="mb-4">📊 Dashboard</h2>

      {/* Cards celulares */}
      <h5 className="text-muted mb-3">📱 Celulares</h5>
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card text-center border-0 shadow-sm">
            <div className="card-body">
              <h2 className="fw-bold text-primary">{totalCelulares}</h2>
              <p className="text-muted mb-0">Total</p>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card text-center border-0 shadow-sm">
            <div className="card-body">
              <h2 className="fw-bold text-success">{emEstoque}</h2>
              <p className="text-muted mb-0">Em Estoque</p>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card text-center border-0 shadow-sm">
            <div className="card-body">
              <h2 className="fw-bold text-primary">{entregues}</h2>
              <p className="text-muted mb-0">Entregues</p>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card text-center border-0 shadow-sm">
            <div className="card-body">
              <h2 className="fw-bold text-warning">{emManutencao}</h2>
              <p className="text-muted mb-0">Manutenção</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards colaboradores */}
      <h5 className="text-muted mb-3">👥 Colaboradores</h5>
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-4">
          <div className="card text-center border-0 shadow-sm">
            <div className="card-body">
              <h2 className="fw-bold text-primary">{totalColaboradores}</h2>
              <p className="text-muted mb-0">Total</p>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-4">
          <div className="card text-center border-0 shadow-sm">
            <div className="card-body">
              <h2 className="fw-bold text-success">{colaboradoresAtivos}</h2>
              <p className="text-muted mb-0">Ativos</p>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-4">
          <div className="card text-center border-0 shadow-sm">
            <div className="card-body">
              <h2 className="fw-bold text-secondary">{colaboradoresInativos}</h2>
              <p className="text-muted mb-0">Inativos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards entregas */}
      <h5 className="text-muted mb-3">📦 Entregas</h5>
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card text-center border-0 shadow-sm">
            <div className="card-body">
              <h2 className="fw-bold text-primary">{totalEntregas}</h2>
              <p className="text-muted mb-0">Total</p>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card text-center border-0 shadow-sm">
            <div className="card-body">
              <h2 className="fw-bold text-success">{entregasAtivas}</h2>
              <p className="text-muted mb-0">Ativas</p>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card text-center border-0 shadow-sm">
            <div className="card-body">
              <h2 className="fw-bold text-danger">{entregasAtrasadas}</h2>
              <p className="text-muted mb-0">Atrasadas</p>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card text-center border-0 shadow-sm">
            <div className="card-body">
              <h2 className="fw-bold text-secondary">{entregasDevolvidas}</h2>
              <p className="text-muted mb-0">Devolvidas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerta entregas atrasadas */}
      {entregasAtrasadas > 0 && (
        <div className="alert alert-danger mt-2">
          ⚠️ Você tem <strong>{entregasAtrasadas}</strong> entrega(s) em atraso! Verifique a aba de Entregas.
        </div>
      )}
    </div>
  );
}

export default Dashboard;