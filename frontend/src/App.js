import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Celulares from './pages/Celulares';
import Colaboradores from './pages/Colaboradores';
import Entregas from './pages/Entregas';
import Historico from './pages/Historico';
import GerenciarUsuarios from './pages/GerenciarUsuarios'; // 👑 NOVO
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const [paginaAtual, setPaginaAtual] = useState('celulares');
  const [logado, setLogado] = useState(false);
  const [username, setUsername] = useState('');
  const [tipo, setTipo] = useState('');

  // 🔄 Verifica login ao carregar
  useEffect(() => {
    const token = localStorage.getItem('token');
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
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('tipo');
    setLogado(false);
    setPaginaAtual('celulares');
  };

  // 🔀 Controle de páginas
  const renderizarPagina = () => {

    switch (paginaAtual) {

      case 'celulares':
        return <Celulares tipo={tipo} />;

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
        return <Celulares tipo={tipo} />;
    }
  };

  if (!logado) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div>

      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <div className="container-fluid">

          <span className="navbar-brand mb-0 h1">
            🏢 Sistema de Controle de Celulares
          </span>

          <ul className="navbar-nav d-flex flex-row gap-3">

            {/* 📱 Celulares */}
            <li className="nav-item">
              <button
                className={`nav-link btn btn-link ${paginaAtual === 'celulares' ? 'active text-white' : 'text-secondary'}`}
                onClick={() => setPaginaAtual('celulares')}
              >
                📱 Celulares
              </button>
            </li>

            {/* 👥 Colaboradores - só ADMIN */}
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

            {/* 👑 Gerenciar Usuários - só ADMIN */}
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

            {/* 📦 Entregas */}
            <li className="nav-item">
              <button
                className={`nav-link btn btn-link ${paginaAtual === 'entregas' ? 'active text-white' : 'text-secondary'}`}
                onClick={() => setPaginaAtual('entregas')}
              >
                📦 Entregas
              </button>
            </li>

            {/* 🕐 Histórico */}
            <li className="nav-item">
              <button
                className={`nav-link btn btn-link ${paginaAtual === 'historico' ? 'active text-white' : 'text-secondary'}`}
                onClick={() => setPaginaAtual('historico')}
              >
                🕐 Histórico
              </button>
            </li>

          </ul>

          {/* 👤 Usuário logado */}
          <div className="d-flex align-items-center">
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