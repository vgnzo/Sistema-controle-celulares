import React, { useState } from 'react';
import { colaboradorService } from '../services/api';

function ColaboradorForm({ onSucesso, colaboradorEdicao, onCancelar }) {
  const [formData, setFormData] = useState(colaboradorEdicao || {
    registro: '',
    nome: '',
    cpf: '',
    email: '',
    telefoneContato: '',
    departamento: '',
    cargo: '',
    dataAdmissao: '',
    status: 'ativo'
  });

  const formatarCPF = (valor) => {
    const numeros = valor.replace(/\D/g, '');
    const limitado = numeros.slice(0, 11);
    
    if (limitado.length <= 3) {
      return limitado;
    } else if (limitado.length <= 6) {
      return `${limitado.slice(0, 3)}.${limitado.slice(3)}`;
    } else if (limitado.length <= 9) {
      return `${limitado.slice(0, 3)}.${limitado.slice(3, 6)}.${limitado.slice(6)}`;
    } else {
      return `${limitado.slice(0, 3)}.${limitado.slice(3, 6)}.${limitado.slice(6, 9)}-${limitado.slice(9)}`;
    }
  };

  const formatarTelefone = (valor) => {
  const numeros = valor.replace(/\D/g, '');
  const limitado = numeros.slice(0, 11);

  if (limitado.length <= 2) {
    return `(${limitado}`;
  } else if (limitado.length <= 7) {
    return `(${limitado.slice(0, 2)}) ${limitado.slice(2)}`;
  } else {
    return `(${limitado.slice(0, 2)}) ${limitado.slice(2, 7)}-${limitado.slice(7)}`;
  }
};

 const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === 'cpf') {
    setFormData({
      ...formData,
      [name]: formatarCPF(value)
    });

  } else if (name === 'telefoneContato') {
    setFormData({
      ...formData,
      [name]: formatarTelefone(value)
    });

  } else if (name === 'registro') {
    // Permite apenas números
    const somenteNumeros = value.replace(/\D/g, '');
    setFormData({
      ...formData,
      [name]: somenteNumeros
    });

  } else {
    setFormData({
      ...formData,
      [name]: value
    });
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
const dadosParaEnviar = {
  ...formData,
  cpf: formData.cpf.replace(/\D/g, ''),
  telefoneContato: formData.telefoneContato.replace(/\D/g, '')
};

    try {
      if (colaboradorEdicao) {
        await colaboradorService.atualizar(dadosParaEnviar.registro, dadosParaEnviar);
        alert('Colaborador atualizado com sucesso!');
      } else {
        await colaboradorService.cadastrar(dadosParaEnviar);
        alert('Colaborador cadastrado com sucesso!');
      }

      setFormData({
        registro: '',
        nome: '',
        cpf: '',
        email: '',
        telefoneContato: '',
        departamento: '',
        cargo: '',
        dataAdmissao: '',
        status: 'ativo'
      });

      onSucesso();
    } catch (error) {
      alert('Erro ao salvar colaborador: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="mb-0">{colaboradorEdicao ? '✏️ Editar Colaborador' : '➕ Cadastrar Novo Colaborador'}</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Registro *</label>
              <input
                type="text"
                name="registro"
                className="form-control"
                value={formData.registro}
                onChange={handleChange}
                placeholder="Ex: 001"
                required
                disabled={!!colaboradorEdicao}
              />
            </div>

            <div className="col-md-8 mb-3">
              <label className="form-label">Nome Completo *</label>
              <input
                type="text"
                name="nome"
                className="form-control"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Ex: João Silva"
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">CPF *</label>
              <input
                type="text"
                name="cpf"
                className="form-control"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
                required
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ex: joao@empresa.com"
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Telefone</label>
              <input
                type="text"
                name="telefoneContato"
                className="form-control"
                value={formData.telefoneContato}
                onChange={handleChange}
                placeholder="Ex: (11) 99999-9999"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Departamento</label>
              <input
                type="text"
                name="departamento"
                className="form-control"
                value={formData.departamento}
                onChange={handleChange}
                placeholder="Ex: TI, RH, Vendas"
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Cargo</label>
              <input
                type="text"
                name="cargo"
                className="form-control"
                value={formData.cargo}
                onChange={handleChange}
                placeholder="Ex: Analista, Gerente"
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
                <option value="inativo">❌ Inativo</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Data de Admissão</label>
              <input
                type="date"
                name="dataAdmissao"
                className="form-control"
                value={formData.dataAdmissao}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary">
              {colaboradorEdicao ? '💾 Atualizar' : '✅ Cadastrar'}
            </button>
            
            {colaboradorEdicao && (
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

export default ColaboradorForm;