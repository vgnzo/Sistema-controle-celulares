import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Celulares from './pages/Celulares';
import Colaboradores from './pages/Colaboradores';
import Entregas from './pages/Entregas';
import Historico from './pages/Historico';
import GerenciarUsuarios from './pages/GerenciarUsuarios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Chips from './pages/Chips';
import Computadores from './pages/Computadores';
import EntregasComputador from './pages/EntregasComputador';
import HistoricoComputador from './pages/HistoricoComputador';
import SelecaoModulo from './pages/SelecaoModulo';
import Passagens from './pages/Passagens';
import Hoteis from './pages/Hoteis';
import Aprovacoes from './pages/Aprovacoes';
import HistoricoViagem from './pages/HistoricoViagem';
import MeusPedidos from './pages/MeusPedidos';

function App() {

  const [paginaAtual, setPaginaAtual] = useState('dashboard');
  const [logado, setLogado] = useState(false);
  const [username, setUsername] = useState('');
  const [tipo, setTipo] = useState('');
  const [modulo, setModulo] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('username');
    const tipoStorage = localStorage.getItem('tipo');

    if (token && user) {
      setLogado(true);
      setUsername(user);
      setTipo(tipoStorage);
    }
  }, []);

  const handleLogin = () => {
    const user = localStorage.getItem('username');
    const tipoStorage = localStorage.getItem('tipo');
    setLogado(true);
    setUsername(user);
    setTipo(tipoStorage);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    localStorage.removeItem('tipo');
    setLogado(false);
    setModulo('');
    setPaginaAtual('dashboard');
  };

  const handleSelecionarModulo = (mod) => {
    setModulo(mod);
    setPaginaAtual('dashboard');
  };

  const handleTrocarModulo = () => {
    setModulo('');
    setPaginaAtual('dashboard');
  };

  // troca de página e fecha o menu hambúrguer (no celular)
  const irPara = (pagina) => {
    setPaginaAtual(pagina);
    const navbar = document.getElementById('menuPrincipal');
    if (navbar && navbar.classList.contains('show')) {
      navbar.classList.remove('show');
    }
  };

  const renderizarPagina = () => {
    switch (paginaAtual) {

      case 'dashboard':
        return <Dashboard modulo={modulo} />;

      case 'celulares':
        return <Celulares tipo={tipo} />;

      case 'chips':
        return <Chips tipo={tipo} />;

      case 'computadores':
        return <Computadores tipo={tipo} />;

      case 'entregas-computador':
        return <EntregasComputador tipo={tipo} />;

      case 'historico-computador':
        return <HistoricoComputador />;

      case 'passagens':
        return <Passagens tipo={tipo} />;

      case 'hoteis':
        return <Hoteis tipo={tipo} />;

         case 'meus-pedidos':
        return <MeusPedidos />;

      case 'aprovacoes':
        if (tipo !== 'ADMIN') return <h3>Acesso negado</h3>;
        return <Aprovacoes />;

      case 'historico-viagem':
        return <HistoricoViagem />;

      case 'colaboradores':
        if (tipo !== 'ADMIN') return <h3>Acesso negado</h3>;
        return <Colaboradores />;

      case 'usuarios':
        if (tipo !== 'ADMIN') return <h3>Acesso negado</h3>;
        return <GerenciarUsuarios tipo={tipo} />;

      case 'entregas':
        return <Entregas tipo={tipo} />;

      case 'historico':
        return <Historico />;

      default:
        return <Dashboard modulo={modulo} />;
    }
  };

  if (!logado) {
    return <Login onLogin={handleLogin} />;
  }

  if (!modulo) {
    return (
      <>
        <SelecaoModulo
          username={username}
          onSelecionar={handleSelecionarModulo}
          onLogout={handleLogout}
        />
        <ToastContainer position="top-right" autoClose={3000} />
      </>
    );
  }

  const tituloModulo =
    modulo === 'celular' ? '📱 Sistema de Celulares' :
    modulo === 'computador' ? '💻 Sistema de Computadores' :
    '✈️ Sistema de Viagem';

  // classe helper pros botões do menu
  const navBtn = (pagina) =>
    `nav-link btn btn-link text-start ${paginaAtual === pagina ? 'active text-white' : 'text-secondary'}`;

  return (
    <div>

      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <div className="container-fluid">

          <span className="navbar-brand mb-0 h1">
            {tituloModulo}
          </span>

          {/* Botão hambúrguer (aparece só no celular) */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#menuPrincipal"
            aria-controls="menuPrincipal"
            aria-expanded="false"
            aria-label="Abrir menu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Conteúdo que colapsa no celular */}
          <div className="collapse navbar-collapse" id="menuPrincipal">

            <ul className="navbar-nav me-auto mb-2 mb-lg-0">

              <li className="nav-item">
                <button className={navBtn('dashboard')} onClick={() => irPara('dashboard')}>
                  📊 Dashboard
                </button>
              </li>

              {/* ===== MÓDULO CELULAR ===== */}
              {modulo === 'celular' && (
                <>
                  <li className="nav-item">
                    <button className={navBtn('celulares')} onClick={() => irPara('celulares')}>
                      📱 Celulares
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className={navBtn('chips')} onClick={() => irPara('chips')}>
                      📶 Chips
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className={navBtn('entregas')} onClick={() => irPara('entregas')}>
                      📦 Entregas
                    </button>
                  </li>
                  {tipo === 'ADMIN' && (
                    <li className="nav-item">
                      <button className={navBtn('colaboradores')} onClick={() => irPara('colaboradores')}>
                        👥 Colaboradores
                      </button>
                    </li>
                  )}
                  <li className="nav-item">
                    <button className={navBtn('historico')} onClick={() => irPara('historico')}>
                      🕐 Histórico
                    </button>
                  </li>
                </>
              )}

              {/* ===== MÓDULO COMPUTADOR ===== */}
              {modulo === 'computador' && (
                <>
                  <li className="nav-item">
                    <button className={navBtn('computadores')} onClick={() => irPara('computadores')}>
                      💻 Computadores
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className={navBtn('entregas-computador')} onClick={() => irPara('entregas-computador')}>
                      📦 Entregas
                    </button>
                  </li>
                  {tipo === 'ADMIN' && (
                    <li className="nav-item">
                      <button className={navBtn('colaboradores')} onClick={() => irPara('colaboradores')}>
                        👥 Colaboradores
                      </button>
                    </li>
                  )}
                  <li className="nav-item">
                    <button className={navBtn('historico-computador')} onClick={() => irPara('historico-computador')}>
                      🕐 Histórico
                    </button>
                  </li>
                </>
              )}

           {/* ===== MÓDULO VIAGEM ===== */}
              {modulo === 'viagem' && (
                <>
                  <li className="nav-item">
                    <button className={navBtn('passagens')} onClick={() => irPara('passagens')}>
                      ✈️ Passagens
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className={navBtn('hoteis')} onClick={() => irPara('hoteis')}>
                      🏨 Hotéis
                    </button>
                  </li>

                  {/* Meus Pedidos - só pro USER (admin tem Aprovações) */}
                  {tipo !== 'ADMIN' && (
                    <li className="nav-item">
                      <button className={navBtn('meus-pedidos')} onClick={() => irPara('meus-pedidos')}>
                        📋 Meus Pedidos
                      </button>
                    </li>
                  )}

                  {tipo === 'ADMIN' && (
                    <li className="nav-item">
                      <button className={navBtn('aprovacoes')} onClick={() => irPara('aprovacoes')}>
                        ✅ Aprovações
                      </button>
                    </li>
                  )}
                  {tipo === 'ADMIN' && (
                    <li className="nav-item">
                      <button className={navBtn('colaboradores')} onClick={() => irPara('colaboradores')}>
                        👥 Colaboradores
                      </button>
                    </li>
                  )}
                  <li className="nav-item">
                    <button className={navBtn('historico-viagem')} onClick={() => irPara('historico-viagem')}>
                      🕐 Histórico
                    </button>
                  </li>
                </>
              )}

              {/* ===== USUÁRIOS (sempre por último, em todos os mundos) ===== */}
              {tipo === 'ADMIN' && (
                <li className="nav-item">
                  <button className={navBtn('usuarios')} onClick={() => irPara('usuarios')}>
                    👑 Usuários
                  </button>
                </li>
              )}

            </ul>

            {/* Ações da direita (trocar sistema, user, sair) */}
            <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2">
              <button
                className="btn btn-outline-warning btn-sm"
                onClick={handleTrocarModulo}
              >
                🔄 Trocar Sistema
              </button>
              <span className="text-white small text-center">
                👤 {username} ({tipo})
              </span>
              <button
                className="btn btn-outline-light btn-sm"
                onClick={handleLogout}
              >
                🚪 Sair
              </button>
            </div>

          </div>
        </div>
      </nav>

      <div className="container mt-4">
        {renderizarPagina()}

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
        />
      </div>

    </div>
  );
}

export default App;