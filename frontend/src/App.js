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
import SelecaoModulo from './pages/SelecaoModulo';
import EntregasComputador from './pages/EntregasComputador';


function App() {

  const [paginaAtual, setPaginaAtual] = useState('dashboard');
  const [logado, setLogado] = useState(false);
  const [username, setUsername] = useState('');
  const [tipo, setTipo] = useState('');

  // 🔥 qual sistema (módulo) está selecionado: '' (nenhum), 'celular' ou 'computador'
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

  // 🔥 escolhe o módulo e entra no dashboard dele
  const handleSelecionarModulo = (mod) => {
    setModulo(mod);
    setPaginaAtual('dashboard');
  };

  // 🔥 volta pra tela de seleção (trocar de sistema)
  const handleTrocarModulo = () => {
    setModulo('');
    setPaginaAtual('dashboard');
  };

  const renderizarPagina = () => {
    switch (paginaAtual) {

      case 'dashboard':
        return <Dashboard />;

      case 'celulares':
        return <Celulares tipo={tipo} />;

      case 'chips':
        return <Chips tipo={tipo} />;

      case 'computadores':
        return <Computadores tipo={tipo} />;

      case 'colaboradores':
        if (tipo !== 'ADMIN') return <h3>Acesso negado</h3>;
        return <Colaboradores />;

      case 'usuarios':
        if (tipo !== 'ADMIN') return <h3>Acesso negado</h3>;
        return <GerenciarUsuarios tipo={tipo} />;

      case 'entregas':
        return <Entregas tipo={tipo} />;

        case 'entregasComputador':
  return <EntregasComputador tipo={tipo} />;

      case 'historico':
        return <Historico />;

      default:
        return <Dashboard />;
    }
  };

  // 1) Não logado → tela de login
  if (!logado) {
    return <Login onLogin={handleLogin} />;
  }

  // 2) Logado mas sem módulo escolhido → tela de seleção
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

  // 3) Logado + módulo escolhido → o sistema daquele módulo
  return (
    <div>

      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <div className="container-fluid">

          <span className="navbar-brand mb-0 h1">
            {modulo === 'celular' ? '📱 Sistema de Celulares' : '💻 Sistema de Computadores'}
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

            {/* ===== ITENS DO MÓDULO CELULAR ===== */}
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

           {/* ===== ITENS DO MÓDULO COMPUTADOR ===== */}
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
                      className={`nav-link btn btn-link ${paginaAtual === 'entregasComputador' ? 'active text-white' : 'text-secondary'}`}
                      onClick={() => setPaginaAtual('entregasComputador')}
                    >
                      📦 Entregas
                    </button>
                  </li>
                </>
              )}

            {/* ===== COMPARTILHADOS (os dois módulos) ===== */}
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