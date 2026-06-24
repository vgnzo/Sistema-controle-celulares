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
import Aprovacoes from './pages/Aprovacoes'; // ✅ novo

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

      // ✅ nova página de aprovações
      case 'aprovacoes':
        if (tipo !== 'ADMIN') return <h3>Acesso negado</h3>;
        return <Aprovacoes />;

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

  return (
    <div>

      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <div className="container-fluid">

          <span className="navbar-brand mb-0 h1">
            {tituloModulo}
          </span>

          <ul className="navbar-nav d-flex flex-row gap-3">

            <li className="nav-item">
              <button
                className={`nav-link btn btn-link ${paginaAtual === 'dashboard' ? 'active text-white' : 'text-secondary'}`}
                onClick={() => setPaginaAtual('dashboard')}
              >
                📊 Dashboard
              </button>
            </li>

            {/* ===== MÓDULO CELULAR ===== */}
            {modulo === 'celular' && (
              <>
                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-link ${paginaAtual === 'celulares' ? 'active text-white' : 'text-secondary'}`}
                    onClick={() => setPaginaAtual('celulares')}
                  >
                    📱 Celulares
                  </button>
                </li>

                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-link ${paginaAtual === 'chips' ? 'active text-white' : 'text-secondary'}`}
                    onClick={() => setPaginaAtual('chips')}
                  >
                    📶 Chips
                  </button>
                </li>

                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-link ${paginaAtual === 'entregas' ? 'active text-white' : 'text-secondary'}`}
                    onClick={() => setPaginaAtual('entregas')}
                  >
                    📦 Entregas
                  </button>
                </li>

                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-link ${paginaAtual === 'historico' ? 'active text-white' : 'text-secondary'}`}
                    onClick={() => setPaginaAtual('historico')}
                  >
                    🕐 Histórico
                  </button>
                </li>
              </>
            )}

            {/* ===== MÓDULO COMPUTADOR ===== */}
            {modulo === 'computador' && (
              <>
                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-link ${paginaAtual === 'computadores' ? 'active text-white' : 'text-secondary'}`}
                    onClick={() => setPaginaAtual('computadores')}
                  >
                    💻 Computadores
                  </button>
                </li>

                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-link ${paginaAtual === 'entregas-computador' ? 'active text-white' : 'text-secondary'}`}
                    onClick={() => setPaginaAtual('entregas-computador')}
                  >
                    📦 Entregas
                  </button>
                </li>

                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-link ${paginaAtual === 'historico-computador' ? 'active text-white' : 'text-secondary'}`}
                    onClick={() => setPaginaAtual('historico-computador')}
                  >
                    🕐 Histórico
                  </button>
                </li>
              </>
            )}

            {/* ===== MÓDULO VIAGEM ===== */}
            {modulo === 'viagem' && (
              <>
                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-link ${paginaAtual === 'passagens' ? 'active text-white' : 'text-secondary'}`}
                    onClick={() => setPaginaAtual('passagens')}
                  >
                    ✈️ Passagens
                  </button>
                </li>

                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-link ${paginaAtual === 'hoteis' ? 'active text-white' : 'text-secondary'}`}
                    onClick={() => setPaginaAtual('hoteis')}
                  >
                    🏨 Hotéis
                  </button>
                </li>

                {/* ✅ Aprovações — só admin vê, só aparece no módulo viagem */}
                {tipo === 'ADMIN' && (
                  <li className="nav-item">
                    <button
                      className={`nav-link btn btn-link ${paginaAtual === 'aprovacoes' ? 'active text-white' : 'text-secondary'}`}
                      onClick={() => setPaginaAtual('aprovacoes')}
                    >
                      ✅ Aprovações
                    </button>
                  </li>
                )}
              </>
            )}

            {/* ===== COMPARTILHADOS ===== */}
            {tipo === 'ADMIN' && (
              <li className="nav-item">
                <button
                  className={`nav-link btn btn-link ${paginaAtual === 'colaboradores' ? 'active text-white' : 'text-secondary'}`}
                  onClick={() => setPaginaAtual('colaboradores')}
                >
                  👥 Colaboradores
                </button>
              </li>
            )}

            {tipo === 'ADMIN' && (
              <li className="nav-item">
                <button
                  className={`nav-link btn btn-link ${paginaAtual === 'usuarios' ? 'active text-white' : 'text-secondary'}`}
                  onClick={() => setPaginaAtual('usuarios')}
                >
                  👑 Usuários
                </button>
              </li>
            )}

          </ul>

          <div className="d-flex align-items-center">
            <button
              className="btn btn-outline-warning btn-sm me-3"
              onClick={handleTrocarModulo}
            >
              🔄 Trocar Sistema
            </button>
            <span className="text-white me-3">
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