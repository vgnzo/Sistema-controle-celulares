import React, { useState } from 'react';
import { computadorService } from '../services/api';
import { toast } from 'react-toastify';

function ComputadorForm({ onSucesso, computadorEdicao, onCancelar }){
    const [formData, setFormData] = useState(computadorEdicao || {
        numeroPatrimonio: '',
        numeroSerie: '',
        marca: '',
        modelo: '',
        fornecedor: '',
        proprietario: '',
        macAddress: '',
        status: 'em estoque',
        dataAquisicao: '',
        vidaUtil: ''
    });

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
            ...formData,
            // vidaUtil vazio vira null (evita erro de conversão pra número no backend)
            vidaUtil: formData.vidaUtil === '' ? null : Number(formData.vidaUtil)
        };

        try {
            if (computadorEdicao){
                await computadorService.atualizar(dadosParaEnviar.numeroPatrimonio, dadosParaEnviar);
                toast.success('✅ Computador atualizado com sucesso!');
            } else {
                await computadorService.cadastrar(dadosParaEnviar);
                toast.success('✅ Computador cadastrado com sucesso!');
            }

            //limpa formulario
            setFormData({
                numeroPatrimonio: '',
                numeroSerie: '',
                marca: '',
                modelo: '',
                fornecedor: '',
                proprietario: '',
                macAddress: '',
                status: 'em estoque',
                dataAquisicao: '',
                vidaUtil: ''
            });

            onSucesso(); //Vai recarregar a lista
        } catch (error){
            // mostra o erro real do backend
            toast.error(error.response?.data?.mensagem || error.response?.data || '❌ Erro ao salvar computador');
        }
    };

    return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="mb-0">{computadorEdicao ? '✏️ Editar Computador' : '➕ Cadastrar Novo Computador'}</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Nº Patrimônio *</label>
              <input
                type="text"
                name="numeroPatrimonio"
                className="form-control"
                value={formData.numeroPatrimonio}
                onChange={handleChange}
                placeholder="Ex: PC001"
                required
                disabled={!!computadorEdicao}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Nº de Série</label>
              <input
                type="text"
                name="numeroSerie"
                className="form-control"
                value={formData.numeroSerie}
                onChange={handleChange}
                placeholder="Ex: SN123456"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Marca</label>
              <input
                type="text"
                name="marca"
                className="form-control"
                list="marcas-sugeridas"
                value={formData.marca}
                onChange={handleChange}
                placeholder="Digite ou escolha a marca"
              />
              <datalist id="marcas-sugeridas">
                <option value="Dell" />
                <option value="Lenovo" />
                <option value="HP" />
                <option value="Acer" />
                <option value="Asus" />
                <option value="Samsung" />
                <option value="Apple" />
                <option value="Positivo" />
              </datalist>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Modelo *</label>
              <input
                type="text"
                name="modelo"
                className="form-control"
                value={formData.modelo}
                onChange={handleChange}
                placeholder="Ex: Latitude 5520"
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Fornecedor</label>
              <input
                type="text"
                name="fornecedor"
                className="form-control"
                value={formData.fornecedor}
                onChange={handleChange}
                placeholder="De quem comprou/aluga"
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Proprietário</label>
              <input
                type="text"
                name="proprietario"
                className="form-control"
                value={formData.proprietario}
                onChange={handleChange}
                placeholder="Dono do equipamento"
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">MAC Address</label>
              <input
                type="text"
                name="macAddress"
                className="form-control"
                value={formData.macAddress}
                onChange={handleChange}
                placeholder="00:1A:2B:3C:4D:5E"
              />
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
                <option value="entregue">💻 Entregue</option>
                <option value="manutencao">🔧 Manutenção</option>
                <option value="devolvido">↩️ Devolvido</option>
                <option value="baixado">🗑️ Baixado</option>
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
                placeholder="Ex: 60"
              />
            </div>

            <div className="col-md-4 mb-3">
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
              {computadorEdicao ? '💾 Atualizar' : '✅ Cadastrar'}
            </button>

            {computadorEdicao && (
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

export default ComputadorForm;