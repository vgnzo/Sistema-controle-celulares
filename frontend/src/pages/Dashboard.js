import React, { useState, useEffect } from 'react';
import { celularService, colaboradorService, entregaService, chipService } from '../services/api';

function Dashboard() {
  const [celulares, setCelulares] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
  const [entregas, setEntregas] = useState([]);
  const [chips, setChips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [agora, setAgora] = useState(new Date());

  const username = localStorage.getItem('username');
  const tipo = localStorage.getItem('tipo');

  useEffect(() => {
    carregarDados();
    const intervalo = setInterval(() => setAgora(new Date()), 1000);
    return () => clearInterval(intervalo);
  }, []);

  const carregarDados = async () => {
    try {
      const [resCelulares, resColaboradores, resEntregas, resChips] = await Promise.all([
        celularService.listarTodos(),
        colaboradorService.listarTodos(),
        entregaService.listarTodas(),
        chipService.listarTodos()
      ]);
      setCelulares(resCelulares.data);
      setColaboradores(resColaboradores.data);
      setEntregas(resEntregas.data);
      setChips(resChips.data);
    } catch (error) {
      console.error('Erro ao carregar dashboard', error);
    } finally {
      setLoading(false);
    }
  };

  const getSaudacao = () => {
    const hora = agora.getHours();
    if (hora < 12) return 'Bom dia';
    if (hora < 18) return 'Boa tarde';
    return 'Boa noite';
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

  const totalColaboradores = colaboradores.length;
  const colaboradoresAtivos = colaboradores.filter(c => c.status === 'ativo').length;
  const colaboradoresInativos = colaboradores.filter(c => c.status === 'inativo').length;

  const totalEntregas = entregas.length;
  const entregasAtivas = entregas.filter(e => e.status === 'ativo').length;
  const entregasAtrasadas = entregas.filter(e => e.status === 'atrasado').length;
  const entregasDevolvidas = entregas.filter(e => e.status === 'devolvido').length;

  const totalChips = chips.length;
  const chipsDisponiveis = chips.filter(c => c.status === 'disponivel').length;
  const chipsEmUso = chips.filter(c => c.status === 'em uso').length;
  const chipsComProblema = chips.filter(c => c.status === 'com problema').length;

  return (
    <div>

      {/* Saudação e data/hora */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">📊 Dashboard</h2>
          <p className="text-muted mb-0">
            {getSaudacao()}, <strong>{username}</strong>! 👋
            {tipo === 'ADMIN' && <span className="badge bg-danger ms-2">ADMIN</span>}
          </p>
        </div>
        <div className="text-end">
          <p className="mb-0 fw-bold">
            {agora.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
          <p className="text-muted mb-0">{agora.toLocaleTimeString('pt-BR')}</p>
        </div>
      </div>

      {/* Alerta entregas atrasadas (só admin) */}
     {tipo === 'ADMIN' && entregasAtrasadas > 0 && (
        <div className="alert alert-danger">
          ⚠️ Você tem <strong>{entregasAtrasadas}</strong> entrega(s) em atraso! Verifique a aba de Entregas.
        </div>
      )}

    {/* Alerta chips com problema (só admin) */}
    {tipo === 'ADMIN' && chipsComProblema > 0 && (
        <div className="alert alert-warning">
          ⚠️ Você tem <strong>{chipsComProblema}</strong> chip(s) com problema! Verifique a aba de Chips.
        </div>
      )}

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

      {/* Cards chips */}
      <h5 className="text-muted mb-3">📶 Chips</h5>
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card text-center border-0 shadow-sm">
            <div className="card-body">
              <h2 className="fw-bold text-primary">{totalChips}</h2>
              <p className="text-muted mb-0">Total</p>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card text-center border-0 shadow-sm">
            <div className="card-body">
              <h2 className="fw-bold text-success">{chipsDisponiveis}</h2>
              <p className="text-muted mb-0">Disponíveis</p>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card text-center border-0 shadow-sm">
            <div className="card-body">
              <h2 className="fw-bold text-info">{chipsEmUso}</h2>
              <p className="text-muted mb-0">Em Uso</p>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card text-center border-0 shadow-sm">
            <div className="card-body">
              <h2 className="fw-bold text-warning">{chipsComProblema}</h2>
              <p className="text-muted mb-0">Com Problema</p>
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

    </div>
  );
}

export default Dashboard;