import React, { useState, useEffect, useCallback } from 'react';
import { entregaComputadorService, computadorService, colaboradorService } from '../services/api';
import { toast } from 'react-toastify';

// Acessórios comuns (os outros o usuário digita no campo "Outro")
const ACESSORIOS_COMUNS = ['Carregador', 'Mouse', 'Teclado', 'Monitor', 'Mochila/Case'];

// Departamentos comuns (qualquer outro o usuário digita via "Outro")
const DEPTS_COMUNS = ['Administrativo','Financeiro','Comercial','Operacional','TI','RH','Marketing','Logística'];

function EntregaComputadorForm({ onSucesso, entregaEdicao, onCancelar }){
  const [formData, setFormData] = useState({
    numeroPatrimonio: '',
    registro: '',
    dataEntrega: '',
    departamento: '',
    status: 'ativo'
  });

  const [computadores, setComputadores] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📦 Acessórios que vão junto na entrega
  const [acessoriosSelecionados, setAcessoriosSelecionados] = useState([]); // os comuns marcados
  const [outroAcessorio, setOutroAcessorio] = useState('');                  // os digitados

  // 🏢 controla se o departamento "Outro" (caixa de texto) está ativo
  const [deptOutro, setDeptOutro] = useState(false);

  const carregarDados = useCallback(async () => {
    try {
      const [computadoresRes, colaboradoresRes] = await Promise.all([
        computadorService.listarTodos(),
        colaboradorService.listarTodos()
      ]);

      setComputadores(computadoresRes.data);
      setColaboradores(colaboradoresRes.data);

      if (entregaEdicao) {
        setFormData({
          numeroPatrimonio: entregaEdicao.computador.numeroPatrimonio,
          registro: entregaEdicao.colaborador.registro,
          dataEntrega: entregaEdicao.dataEntrega,
          departamento: entregaEdicao.departamento || '',
          status: entregaEdicao.status
        });

        // se o departamento salvo não for um dos comuns, abre no modo "Outro"
        if (entregaEdicao.departamento && !DEPTS_COMUNS.includes(entregaEdicao.departamento)) {
          setDeptOutro(true);
        }

        // separa os acessórios salvos entre "comuns" (checkbox) e "outros" (texto)
        if (entregaEdicao.acessorios) {
          const lista = entregaEdicao.acessorios.split(',').map(s => s.trim()).filter(Boolean);
          setAcessoriosSelecionados(lista.filter(a => ACESSORIOS_COMUNS.includes(a)));
          setOutroAcessorio(lista.filter(a => !ACESSORIOS_COMUNS.includes(a)).join(', '));
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar computadores e colaboradores');
    } finally {
      setLoading(false);
    }
  }, [entregaEdicao]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // handler do select de departamento (lida com "Outro")
  const handleDepartamentoSelect = (e) => {
    const value = e.target.value;
    if (value === 'Outro') {
      setDeptOutro(true);
      setFormData({ ...formData, departamento: '' });
    } else {
      setDeptOutro(false);
      setFormData({ ...formData, departamento: value });
    }
  };

  // marca/desmarca um acessório comum
  const toggleAcessorio = (item) => {
    setAcessoriosSelecionados(prev =>
      prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // monta a string de acessórios: comuns marcados + o que foi digitado em "Outro"
    const todosAcessorios = [...acessoriosSelecionados];
    if (outroAcessorio.trim()) todosAcessorios.push(outroAcessorio.trim());
    const acessoriosStr = todosAcessorios.join(', ');

    const dadosParaEnviar = {
      computador: {
        numeroPatrimonio: formData.numeroPatrimonio
      },
      colaborador: {
        registro: formData.registro
      },
      dataEntrega: formData.dataEntrega,
      departamento: formData.departamento,
      status: formData.status,
      acessorios: acessoriosStr,
      ativo: true
    };

    try {
      if (entregaEdicao) {
        await entregaComputadorService.atualizar(entregaEdicao.id, dadosParaEnviar);
      } else {
        await entregaComputadorService.cadastrar(dadosParaEnviar);
      }
    } catch (error) {
      toast.error('❌ Erro ao salvar entrega: ' + (error.response?.data?.mensagem || error.response?.data?.message || error.message));
      return;
    }

    toast.success(entregaEdicao ? '✅ Entrega atualizada com sucesso!' : '✅ Entrega cadastrada com sucesso!');

    setFormData({
      numeroPatrimonio: '',
      registro: '',
      dataEntrega: '',
      departamento: '',
      status: 'ativo'
    });
    setAcessoriosSelecionados([]);
    setOutroAcessorio('');
    setDeptOutro(false);

    onSucesso();
  };

  if (loading) return <div className="text-center">Carregando...</div>;

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="mb-0">{entregaEdicao ? '✏️ Editar Entrega' : '➕ Cadastrar Nova Entrega'}</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Computador *</label>
              <select
                name="numeroPatrimonio"
                className="form-select"
                value={formData.numeroPatrimonio}
                onChange={handleChange}
                required
                disabled={!!entregaEdicao}
              >
                <option value="">Selecione um computador...</option>
                {computadores
                  .filter(c => c.status === 'em estoque' || c.numeroPatrimonio === formData.numeroPatrimonio)
                  .map((computador) => (
                    <option key={computador.numeroPatrimonio} value={computador.numeroPatrimonio}>
                      {computador.numeroPatrimonio} - {computador.modelo}
                    </option>
                  ))}
              </select>
              <small className="text-muted">Apenas computadores em estoque</small>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Colaborador *</label>
              <select
                name="registro"
                className="form-select"
                value={formData.registro}
                onChange={handleChange}
                required
                disabled={!!entregaEdicao}
              >
                <option value="">Selecione um colaborador...</option>
                {colaboradores
                  .filter(c => c.status === 'ativo' || c.registro === formData.registro)
                  .map((colaborador) => (
                    <option key={colaborador.registro} value={colaborador.registro}>
                      {colaborador.registro} - {colaborador.nome}
                    </option>
                  ))}
              </select>
              <small className="text-muted">Apenas colaboradores ativos</small>
            </div>
          </div>

          {/* 📦 Acessórios que vão junto na entrega */}
          <div className="row">
            <div className="col-12 mb-3">
              <label className="form-label">📦 Acessórios entregues</label>
              <div className="d-flex flex-wrap gap-3 mb-2">
                {ACESSORIOS_COMUNS.map((item) => (
                  <div className="form-check" key={item}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`ac-${item}`}
                      checked={acessoriosSelecionados.includes(item)}
                      onChange={() => toggleAcessorio(item)}
                    />
                    <label className="form-check-label" htmlFor={`ac-${item}`}>{item}</label>
                  </div>
                ))}
              </div>
              <input
                type="text"
                className="form-control"
                placeholder="Outro acessório (se for mais de um, separe por vírgula)"
                value={outroAcessorio}
                onChange={(e) => setOutroAcessorio(e.target.value)}
              />
              <small className="text-muted">Marque os acessórios que vão junto com o computador</small>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Data de Entrega *</label>
              <input
                type="date"
                name="dataEntrega"
                className="form-control"
                value={formData.dataEntrega}
                onChange={handleChange}
                required
              />
            </div>

            {/* 🏢 Departamento onde o equipamento está (select + Outro) */}
            <div className="col-md-4 mb-3">
              <label className="form-label">Departamento</label>
              <select
                name="departamento"
                className="form-select"
                value={deptOutro ? 'Outro' : formData.departamento}
                onChange={handleDepartamentoSelect}
              >
                <option value="">Selecione...</option>
                <option value="Administrativo">🏢 Administrativo</option>
                <option value="Financeiro">💰 Financeiro</option>
                <option value="Comercial">📊 Comercial</option>
                <option value="Operacional">⚙️ Operacional</option>
                <option value="TI">💻 TI</option>
                <option value="RH">👥 RH</option>
                <option value="Marketing">📢 Marketing</option>
                <option value="Logística">🚚 Logística</option>
                <option value="Outro">📋 Outro</option>
              </select>

              {/* caixa de texto aparece só quando escolhe "Outro" */}
              {deptOutro && (
                <input
                  type="text"
                  name="departamento"
                  className="form-control mt-2"
                  value={formData.departamento}
                  onChange={handleChange}
                  placeholder="Digite o departamento"
                />
              )}
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Status *</label>
              <select
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="ativo">✅ Ativo</option>
                <option value="devolvido">↩️ Devolvido</option>
                <option value="atrasado">⚠️ Atrasado</option>
              </select>
            </div>
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary">
              {entregaEdicao ? '💾 Atualizar' : '✅ Cadastrar'}
            </button>

            {entregaEdicao && (
              <button type="button" onClick={onCancelar} className="btn btn-secondary">
                ❌ Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default EntregaComputadorForm;