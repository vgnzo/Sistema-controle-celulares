import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Celulares from './pages/Celulares';
import Colaboradores from './pages/Colaboradores';
import Entregas from './pages/Entregas';
// Adicione o import no topo:
import Historico from './pages/Historico';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [paginaAtual, setPaginaAtual] = useState('celulares');
  const [logado, setLogado] = useState(false);
  const [username, setUsername] = useState('');

  // Verificar se já está logado ao carregar
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('username');
    
    if (token && user) {
      setLogado(true);
      setUsername(user);
    }
  }, []);

  const handleLogin = () => {
    const user = localStorage.getItem('username');
    setLogado(true);
    setUsername(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('tipo');
    setLogado(false);
    setPaginaAtual('celulares');
  };

  const renderizarPagina = () => {
    switch (paginaAtual) {
      case 'celulares':
        return <Celulares />;
      case 'colaboradores':
        return <Colaboradores />;
      case 'entregas':
        return <Entregas />;
             case 'historico':
  return <Historico />;
      default:
        return <Celulares />;
   
    }
  };

  // Se não estiver logado, mostra tela de login
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
                className={`nav-link btn btn-link ${paginaAtual === 'colaboradores' ? 'active text-white' : 'text-secondary'}`}
                onClick={() => setPaginaAtual('colaboradores')}
              >
                👥 Colaboradores
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
          </ul>

      

          <div className="d-flex align-items-center">
            <span className="text-white me-3">
              👤 {username}
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