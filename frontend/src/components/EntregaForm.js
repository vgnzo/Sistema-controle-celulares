import React, { useState, useEffect } from 'react';
import { entregaService, celularService, colaboradorService } from '../services/api';

function EntregaForm({ onSucesso, entregaEdicao, onCancelar }){
const [formData, setFormData] = useState({
    imei: '',
      registro: '',
    dataEntrega: '',
    dataPrevistaDevolucao: '',
    status: 'ativo'
  });


  const [celulares, setCelulares] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
        const [celularesRes, colaboradoresRes] = await Promise.all([
            celularService.listarTodos(), 
            colaboradorService.listarTodos()
        ]);

        setCelulares(celularesRes.data)
        setColaboradores(colaboradoresRes.data);

        if (entregaEdicao) {
            setFormData({
            imei: entregaEdicao.id.imei,
             registro: entregaEdicao.id.registro,
          dataEntrega: entregaEdicao.dataEntrega,
          dataPrevistaDevolucao: entregaEdicao.dataPrevistaDevolucao,
          status: entregaEdicao.status
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar celulares e colaboradores');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dadosParaEnviar = {
      id: {
        imei: formData.imei,
        registro: formData.registro
      },
      celular: {
        imei: formData.imei
      },
      colaborador: {
        registro: formData.registro
      },
      dataEntrega: formData.dataEntrega,
      dataPrevistaDevolucao: formData.dataPrevistaDevolucao,
      status: formData.status
    };

    try {
      if (entregaEdicao) {
        await entregaService.atualizar(formData.imei, formData.registro, dadosParaEnviar);
        alert('Entrega atualizada com sucesso!');
      } else {
        await entregaService.cadastrar(dadosParaEnviar);
        alert('Entrega cadastrada com sucesso!');
      }

      setFormData({
        imei: '',
        registro: '',
        dataEntrega: '',
        dataPrevistaDevolucao: '',
        status: 'ativo'
      });

      onSucesso();
    } catch (error) {
      alert('Erro ao salvar entrega: ' + (error.response?.data?.message || error.message));
    }
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
              <label className="form-label">Celular *</label>
              <select
                name="imei"
                className="form-select"
                value={formData.imei}
                onChange={handleChange}
                required
                disabled={!!entregaEdicao}
              >
                <option value="">Selecione um celular...</option>
                {celulares
                  .filter(c => c.status === 'em estoque' || c.imei === formData.imei)
                  .map((celular) => (
                    <option key={celular.imei} value={celular.imei}>
                      {celular.imei} - {celular.modelo}
                    </option>
                  ))}
              </select>
              <small className="text-muted">Apenas celulares em estoque</small>
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

            <div className="col-md-4 mb-3">
              <label className="form-label">Previsão de Devolução *</label>
              <input
                type="date"
                name="dataPrevistaDevolucao"
                className="form-control"
                value={formData.dataPrevistaDevolucao}
                onChange={handleChange}
                required
              />
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

export default EntregaForm;