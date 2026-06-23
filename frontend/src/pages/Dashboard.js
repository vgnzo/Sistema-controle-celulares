import React, { useState, useEffect } from 'react';
import {
  celularService, colaboradorService, entregaService, chipService,
  computadorService, entregaComputadorService
} from '../services/api';

function Dashboard({ modulo }) {
  const [celulares, setCelulares] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
  const [entregas, setEntregas] = useState([]);
  const [chips, setChips] = useState([]);
  const [computadores, setComputadores] = useState([]);
  const [entregasComputador, setEntregasComputador] = useState([]);
  const [loading, setLoading] = useState(true);
  const [agora, setAgora] = useState(new Date());

  const username = localStorage.getItem('username');
  const tipo = localStorage.getItem('tipo');

  // se não vier módulo (fallback), assume celular
  const moduloAtual = modulo || 'celular';

  useEffect(() => {
    carregarDados();
    const intervalo = setInterval(() => setAgora(new Date()), 1000);
    return () => clearInterval(intervalo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduloAtual]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      // colaboradores é comum aos dois módulos
      const promessas = [colaboradorService.listarTodos()];

      if (moduloAtual === 'celular') {
        promessas.push(celularService.listarTodos());   // [1]
        promessas.push(entregaService.listarTodas());    // [2]
        promessas.push(chipService.listarTodos());       // [3]
      } else {
        promessas.push(computadorService.listarTodos());          // [1]
        promessas.push(entregaComputadorService.listarTodas());   // [2]
      }

      const res = await Promise.all(promessas);

      setColaboradores(res[0].data);

      if (moduloAtual === 'celular') {
        setCelulares(res[1].data);
        setEntregas(res[2].data);
        setChips(res[3].data);
      } else {
        setComputadores(res[1].data);
        setEntregasComputador(res[2].data);
      }
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

  // ===== métricas de colaboradores (comum) =====
  const totalColaboradores = colaboradores.length;
  const colaboradoresAtivos = colaboradores.filter(c => c.status === 'ativo').length;
  const colaboradoresInativos = colaboradores.filter(c => c.status === 'inativo').length;

  // ===== métricas do módulo CELULAR =====
  const totalCelulares = celulares.length;
  const emEstoque = celulares.filter(c => c.status === 'em estoque').length;
  const entregues = celulares.filter(c => c.status === 'entregue').length;
  const emManutencao = celulares.filter(c => c.status === 'manutencao').length;

  const totalChips = chips.length;
  const chipsDisponiveis = chips.filter(c => c.status === 'disponivel').length;
  const chipsEmUso = chips.filter(c => c.status === 'em uso').length;
  const chipsComProblema = chips.filter(c => c.status === 'com problema').length;

  const totalEntregas = entregas.length;
  const entregasAtivas = entregas.filter(e => e.status === 'ativo').length;
  const entregasAtrasadas = entregas.filter(e => e.status === 'atrasado').length;
  const entregasDevolvidas = entregas.filter(e => e.status === 'devolvido').length;

  // ===== métricas do módulo COMPUTADOR =====
  const totalComputadores = computadores.length;
  const pcEmEstoque = computadores.filter(c => c.status === 'em estoque').length;
  const pcEntregues = computadores.filter(c => c.status === 'entregue').length;
  const pcManutencao = computadores.filter(c => c.status === 'manutencao').length;

  const totalEntregasPc = entregasComputador.length;
  const entregasPcAtivas = entregasComputador.filter(e => e.status === 'ativo').length;
  const entregasPcAtrasadas = entregasComputador.filter(e => e.status === 'atrasado').length;
  const entregasPcDevolvidas = entregasComputador.filter(e => e.status === 'devolvido').length;

  return (
    <div>

      {/* Saudação e data/hora */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">
            📊 Dashboard {moduloAtual === 'celular' ? '— Celulares' : '— Computadores'}
          </h2>
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

      {/* ====================== MÓDULO CELULAR ====================== */}
      {moduloAtual === 'celular' && (
        <>
          {tipo === 'ADMIN' && entregasAtrasadas > 0 && (
            <div className="alert alert-danger">
              ⚠️ Você tem <strong>{entregasAtrasadas}</strong> entrega(s) em atraso! Verifique a aba de Entregas.
            </div>
          )}
          {tipo === 'ADMIN' && chipsComProblema > 0 && (
            <div className="alert alert-warning">
              ⚠️ Você tem <strong>{chipsComProblema}</strong> chip(s) com problema! Verifique a aba de Chips.
            </div>
          )}

          <h5 className="text-muted mb-3">📱 Celulares</h5>
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3">
              <div className="card text-center border-0 shadow-sm"><div className="card-body">
                <h2 className="fw-bold text-primary">{totalCelulares}</h2><p className="text-muted mb-0">Total</p>
              </div></div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card text-center border-0 shadow-sm"><div className="card-body">
                <h2 className="fw-bold text-success">{emEstoque}</h2><p className="text-muted mb-0">Em Estoque</p>
              </div></div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card text-center border-0 shadow-sm"><div className="card-body">
                <h2 className="fw-bold text-primary">{entregues}</h2><p className="text-muted mb-0">Entregues</p>
              </div></div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card text-center border-0 shadow-sm"><div className="card-body">
                <h2 className="fw-bold text-warning">{emManutencao}</h2><p className="text-muted mb-0">Manutenção</p>
              </div></div>
            </div>
          </div>

          <h5 className="text-muted mb-3">📶 Chips</h5>
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3">
              <div className="card text-center border-0 shadow-sm"><div className="card-body">
                <h2 className="fw-bold text-primary">{totalChips}</h2><p className="text-muted mb-0">Total</p>
              </div></div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card text-center border-0 shadow-sm"><div className="card-body">
                <h2 className="fw-bold text-success">{chipsDisponiveis}</h2><p className="text-muted mb-0">Disponíveis</p>
              </div></div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card text-center border-0 shadow-sm"><div className="card-body">
                <h2 className="fw-bold text-info">{chipsEmUso}</h2><p className="text-muted mb-0">Em Uso</p>
              </div></div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card text-center border-0 shadow-sm"><div className="card-body">
                <h2 className="fw-bold text-warning">{chipsComProblema}</h2><p className="text-muted mb-0">Com Problema</p>
              </div></div>
            </div>
          </div>

          <h5 className="text-muted mb-3">📦 Entregas</h5>
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3">
              <div className="card text-center border-0 shadow-sm"><div className="card-body">
                <h2 className="fw-bold text-primary">{totalEntregas}</h2><p className="text-muted mb-0">Total</p>
              </div></div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card text-center border-0 shadow-sm"><div className="card-body">
                <h2 className="fw-bold text-success">{entregasAtivas}</h2><p className="text-muted mb-0">Ativas</p>
              </div></div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card text-center border-0 shadow-sm"><div className="card-body">
                <h2 className="fw-bold text-danger">{entregasAtrasadas}</h2><p className="text-muted mb-0">Atrasadas</p>
              </div></div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card text-center border-0 shadow-sm"><div className="card-body">
                <h2 className="fw-bold text-secondary">{entregasDevolvidas}</h2><p className="text-muted mb-0">Devolvidas</p>
              </div></div>
            </div>
          </div>
        </>
      )}

      {/* ====================== MÓDULO COMPUTADOR ====================== */}
      {moduloAtual === 'computador' && (
        <>
          {tipo === 'ADMIN' && entregasPcAtrasadas > 0 && (
            <div className="alert alert-danger">
              ⚠️ Você tem <strong>{entregasPcAtrasadas}</strong> entrega(s) de computador em atraso!
            </div>
          )}

          <h5 className="text-muted mb-3">💻 Computadores</h5>
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3">
              <div className="card text-center border-0 shadow-sm"><div className="card-body">
                <h2 className="fw-bold text-primary">{totalComputadores}</h2><p className="text-muted mb-0">Total</p>
              </div></div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card text-center border-0 shadow-sm"><div className="card-body">
                <h2 className="fw-bold text-success">{pcEmEstoque}</h2><p className="text-muted mb-0">Em Estoque</p>
              </div></div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card text-center border-0 shadow-sm"><div className="card-body">
                <h2 className="fw-bold text-primary">{pcEntregues}</h2><p className="text-muted mb-0">Entregues</p>
              </div></div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card text-center border-0 shadow-sm"><div className="card-body">
                <h2 className="fw-bold text-warning">{pcManutencao}</h2><p className="text-muted mb-0">Manutenção</p>
              </div></div>
            </div>
          </div>

          <h5 className="text-muted mb-3">📦 Entregas de Computador</h5>
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3">
              <div className="card text-center border-0 shadow-sm"><div className="card-body">
                <h2 className="fw-bold text-primary">{totalEntregasPc}</h2><p className="text-muted mb-0">Total</p>
              </div></div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card text-center border-0 shadow-sm"><div className="card-body">
                <h2 className="fw-bold text-success">{entregasPcAtivas}</h2><p className="text-muted mb-0">Ativas</p>
              </div></div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card text-center border-0 shadow-sm"><div className="card-body">
                <h2 className="fw-bold text-danger">{entregasPcAtrasadas}</h2><p className="text-muted mb-0">Atrasadas</p>
              </div></div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card text-center border-0 shadow-sm"><div className="card-body">
                <h2 className="fw-bold text-secondary">{entregasPcDevolvidas}</h2><p className="text-muted mb-0">Devolvidas</p>
              </div></div>
            </div>
          </div>
        </>
      )}

      {/* ====================== COLABORADORES (comum aos dois) ====================== */}
      <h5 className="text-muted mb-3">👥 Colaboradores</h5>
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-4">
          <div className="card text-center border-0 shadow-sm"><div className="card-body">
            <h2 className="fw-bold text-primary">{totalColaboradores}</h2><p className="text-muted mb-0">Total</p>
          </div></div>
        </div>
        <div className="col-6 col-md-4">
          <div className="card text-center border-0 shadow-sm"><div className="card-body">
            <h2 className="fw-bold text-success">{colaboradoresAtivos}</h2><p className="text-muted mb-0">Ativos</p>
          </div></div>
        </div>
        <div className="col-6 col-md-4">
          <div className="card text-center border-0 shadow-sm"><div className="card-body">
            <h2 className="fw-bold text-secondary">{colaboradoresInativos}</h2><p className="text-muted mb-0">Inativos</p>
          </div></div>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;