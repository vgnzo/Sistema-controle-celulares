import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username,
        password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('tipo', response.data.tipo);

      onLogin();
    } catch (error) {
      setErro('Usuário ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="card shadow-lg border-0" style={{ borderRadius: '15px' }}>
              <div className="card-body p-5">
                {/* Logo/Ícone */}
                <div className="text-center mb-4">
                  <div style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '40px',
                    marginBottom: '20px'
                  }}>
                    📱
                  </div>
                  <h3 className="fw-bold mb-1">Bem-vindo!</h3>
                  <p className="text-muted">Sistema de Controle de Celulares</p>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-person-fill me-2"></i>
                      Usuário
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Digite seu usuário"
                      required
                      style={{
                        borderRadius: '10px',
                        border: '2px solid #e9ecef'
                      }}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-lock-fill me-2"></i>
                      Senha
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Digite sua senha"
                      required
                      style={{
                        borderRadius: '10px',
                        border: '2px solid #e9ecef'
                      }}
                    />
                  </div>

                  {erro && (
                    <div className="alert alert-danger" role="alert" style={{ borderRadius: '10px' }}>
                      <i className="bi bi-exclamation-circle-fill me-2"></i>
                      {erro}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="btn btn-lg w-100 text-white fw-semibold"
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '12px'
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Entrando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Entrar
                      </>
                    )}
                  </button>
                </form>

                {/* Footer */}
                <div className="text-center mt-4">
                  <small className="text-muted">
                    🔒 Acesso restrito a administradores
                  </small>
                </div>
              </div>
            </div>

            {/* Rodapé */}
            <div className="text-center mt-3">
              <small className="text-white">
                © 2026 Sistema de Controle de Celulares
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;