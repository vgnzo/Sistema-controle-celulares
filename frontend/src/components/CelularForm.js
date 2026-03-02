import React, {useState} from 'react';
import {celularService} from '../services/api';
import { toast } from 'react-toastify';

function CelularForm({ onSucesso, celularEdicao, onCancelar }){
    const [formData, setFormData] = useState(celularEdicao || {
        imei: '',
        modelo: '',
        status: 'em estoque',
        fornecedor: '',
        dataAquisicao: '',
        vidaUtil: ''
    });

   const handleChange = (e) => {
  const { name, value } = e.target;
  
  if (name === 'imei') {
    setFormData({
      ...formData,
      [name]: formatarIMEI(value)
    });
  } else {
    setFormData({
      ...formData,
      [name]: value
    });
  }
};

    const formatarIMEI = (valor) => {
  // Remove tudo que não é número
  const numeros = valor.replace(/\D/g, '');
  
  // Limita a 15 dígitos
  const limitado = numeros.slice(0, 15);
  
  // Aplica a máscara: 999999-999999-999
  if (limitado.length <= 6) {
    return limitado;
  } else if (limitado.length <= 12) {
    return `${limitado.slice(0, 6)}-${limitado.slice(6)}`;
  } else {
    return `${limitado.slice(0, 6)}-${limitado.slice(6, 12)}-${limitado.slice(12)}`;
  }
};

    const handleSubmit = async (e) => {
        e.preventDefault();

          const dadosParaEnviar = {
  ...formData,
  imei: formData.imei.replace(/\D/g, '')
};

          try {
        
            if (celularEdicao){
                await celularService.atualizar(dadosParaEnviar.imei, dadosParaEnviar);
              toast.success('✅ Celular atualizado com sucesso!');
           } else {
    await celularService.cadastrar(dadosParaEnviar);
toast.success('✅ Celular cadastrado com sucesso!');
    }

            //limpa formulario
            setFormData({
                imei: '',
                modelo: '',
                status: 'em estoque',
                fornecedor: '',
                dataAquisicao: '', 
                vidaUtil: ''
            });

            onSucesso(); //Vai recarregar a lista
        } catch (error){
toast.success('✅ Celular cadastrado com sucesso!');             }
    };


    return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="mb-0">{celularEdicao ? '✏️ Editar Celular' : '➕ Cadastrar Novo Celular'}</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">IMEI *</label>
              <input
                type="text"
                name="imei"
                className="form-control"
                value={formData.imei}
                onChange={handleChange}
                placeholder="000000-000000-000"
                required
                disabled={!!celularEdicao}
              />
            </div>

          <div className="col-md-6 mb-3">
  <label className="form-label">Modelo *</label>
  <select
    name="modelo"
    className="form-select"
    value={formData.modelo}
    onChange={handleChange}
    required
  >
    <option value="">Selecione o modelo...</option>
    <option value="Samsung Galaxy S23">📱 Samsung Galaxy S23</option>
    <option value="Samsung Galaxy S22">📱 Samsung Galaxy S22</option>
    <option value="Samsung Galaxy A54">📱 Samsung Galaxy A54</option>
    <option value="iPhone 15">📱 iPhone 15</option>
    <option value="iPhone 14">📱 iPhone 14</option>
    <option value="iPhone 13">📱 iPhone 13</option>
    <option value="Motorola Edge 40">📱 Motorola Edge 40</option>
    <option value="Motorola Moto G54">📱 Motorola Moto G54</option>
    <option value="Xiaomi Redmi Note 13">📱 Xiaomi Redmi Note 13</option>
    <option value="Outro">📱 Outro</option>
  </select>
</div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Status *</label>
              <select
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="em estoque">📦 Em Estoque</option>
                <option value="entregue">📱 Entregue</option>
                <option value="manutencao">🔧 Manutenção</option>
                <option value="devolvido">↩️ Devolvido</option>
              </select>
            </div>
<div className="col-md-4 mb-3">
  <label className="form-label">Operadora</label>
  <select
    name="fornecedor"
    className="form-select"
    value={formData.fornecedor}
    onChange={handleChange}
  >
    <option value="">Selecione...</option>
    <option value="Vivo">📱 Vivo</option>
    <option value="Claro">📱 Claro</option>
    <option value="Tim">📱 Tim</option>
    <option value="Oi">📱 Oi</option>
    <option value="Algar">📱 Algar</option>
    <option value="Outro">📱 Outro</option>
  </select>
</div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Vida Útil (meses)</label>
              <input
                type="number"
                name="vidaUtil"
                className="form-control"
                value={formData.vidaUtil}
                onChange={handleChange}
                placeholder="Ex: 24"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Data de Aquisição *</label>
              <input
                type="date"
                name="dataAquisicao"
                className="form-control"
                value={formData.dataAquisicao}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary">
              {celularEdicao ? '💾 Atualizar' : '✅ Cadastrar'}
            </button>
            
            {celularEdicao && (
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

export default CelularForm;