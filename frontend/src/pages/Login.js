import React, { useState } from 'react';
import api from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login({ onLogin }) {
  const [tela, setTela] = useState('login'); // 'login' ou 'cadastro'
  
  // Login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Cadastro
  const [novoUsername, setNovoUsername] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loadingCadastro, setLoadingCadastro] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('tipo', response.data.tipo);
      onLogin();
    } catch (error) {
      toast.error('❌ Usuário ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    if (novaSenha !== confirmarSenha) {
      toast.error('❌ As senhas não coincidem!');
      return;
    }
    setLoadingCadastro(true);
    try {
      await api.post('/usuarios/register', {
        username: novoUsername,
        senha: novaSenha
      });
      toast.success('✅ Conta criada! Faça login.');
      setTela('login');
      setNovoUsername('');
      setNovaSenha('');
      setConfirmarSenha('');
    } catch (error) {
      toast.error('❌ ' + (error.response?.data || 'Erro ao criar conta'));
    } finally {
      setLoadingCadastro(false);
    }
  };

  const estiloContainer = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  };

  const estiloInput = {
    borderRadius: '10px',
    border: '2px solid #e9ecef'
  };

  const estiloBotao = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '10px',
    padding: '12px'
  };

  return (
    <div style={estiloContainer}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="card shadow-lg border-0" style={{ borderRadius: '15px' }}>
              <div className="card-body p-5">

                {/* Ícone */}
                <div className="text-center mb-4">
                  <div style={{
                    width: '80px', height: '80px', margin: '0 auto',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '40px', marginBottom: '20px'
                  }}>
                    📱
                  </div>
                  <h3 className="fw-bold mb-1">
                    {tela === 'login' ? 'Bem-vindo!' : 'Criar Conta'}
                  </h3>
                  <p className="text-muted">Sistema de Controle de Celulares</p>
                </div>

                {/* TELA DE LOGIN */}
                {tela === 'login' && (
                  <form onSubmit={handleLogin}>
                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-person-fill me-2"></i>Usuário
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="Digite seu usuário"
                        required
                        style={estiloInput}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-lock-fill me-2"></i>Senha
                      </label>
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Digite sua senha"
                        required
                        style={estiloInput}
                      />
                    </div>
                    <button type="submit" className="btn btn-lg w-100 text-white fw-semibold" disabled={loading} style={estiloBotao}>
                      {loading ? (
                        <><span className="spinner-border spinner-border-sm me-2"></span>Entrando...</>
                      ) : (
                        <><i className="bi bi-box-arrow-in-right me-2"></i>Entrar</>
                      )}
                    </button>

                    {/* Botão criar conta */}
                    <div className="text-center mt-3">
                      <span className="text-muted">Não tem conta? </span>
                      <button
                        type="button"
                        className="btn btn-link p-0"
                        onClick={() => setTela('cadastro')}
                      >
                        Criar conta
                      </button>
                    </div>
                  </form>
                )}

                {/* TELA DE CADASTRO */}
                {tela === 'cadastro' && (
                  <form onSubmit={handleCadastro}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-person-fill me-2"></i>Usuário
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        value={novoUsername}
                        onChange={e => setNovoUsername(e.target.value)}
                        placeholder="Escolha um usuário"
                        required
                        style={estiloInput}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-lock-fill me-2"></i>Senha
                      </label>
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        value={novaSenha}
                        onChange={e => setNovaSenha(e.target.value)}
                        placeholder="Escolha uma senha"
                        required
                        style={estiloInput}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-lock-fill me-2"></i>Confirmar Senha
                      </label>
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        value={confirmarSenha}
                        onChange={e => setConfirmarSenha(e.target.value)}
                        placeholder="Confirme sua senha"
                        required
                        style={estiloInput}
                      />
                    </div>
                    <button type="submit" className="btn btn-lg w-100 text-white fw-semibold" disabled={loadingCadastro} style={estiloBotao}>
                      {loadingCadastro ? (
                        <><span className="spinner-border spinner-border-sm me-2"></span>Criando...</>
                      ) : (
                        <>✅ Criar Conta</>
                      )}
                    </button>

                    {/* Voltar para login */}
                    <div className="text-center mt-3">
                      <span className="text-muted">Já tem conta? </span>
                      <button
                        type="button"
                        className="btn btn-link p-0"
                        onClick={() => setTela('login')}
                      >
                        Fazer login
                      </button>
                    </div>
                  </form>
                )}

              </div>
            </div>

            {/* Rodapé */}
            <div className="text-center mt-3">
              <small className="text-white">© 2026 Sistema de Controle de Celulares</small>
              <br />
              <small className="text-white">Desenvolvido por <strong>Vinicius Galdino</strong></small>
            </div>

          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Login;