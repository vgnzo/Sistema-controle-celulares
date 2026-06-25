import React, { useState } from 'react';
import { passagemService } from '../services/api';
import { toast } from 'react-toastify';

function PassagemForm({ onSucesso, passagemEdicao, onCancelar }) {
    const [formData, setFormData] = useState(
        passagemEdicao
            ? {
                  solicitanteNome: passagemEdicao.solicitanteNome || '',
                  solicitanteRegistro: passagemEdicao.solicitanteRegistro || '',
                  destino: passagemEdicao.destino || '',
                  motivo: passagemEdicao.motivo || '',
              }
            : {
                  solicitanteNome: '',
                  solicitanteRegistro: '',
                  destino: '',
                  motivo: '',
              }
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dadosParaEnviar = {
            solicitanteNome: formData.solicitanteNome,
            solicitanteRegistro: formData.solicitanteRegistro,
            destino: formData.destino,
            motivo: formData.motivo,
        };

        try {
            if (passagemEdicao) {
                await passagemService.atualizar(passagemEdicao.id, dadosParaEnviar);
                toast.success('✅ Passagem atualizada com sucesso!');
            } else {
                await passagemService.cadastrar(dadosParaEnviar);
                toast.success('✅ Solicitação enviada! Aguarde aprovação.');
            }

            setFormData({ solicitanteNome: '', solicitanteRegistro: '', destino: '', motivo: '' });
            onSucesso();
        } catch (error) {
            toast.error(error.response?.data?.mensagem || error.response?.data || '❌ Erro ao salvar passagem');
        }
    };

    return (
        <div className="card mb-4">
            <div className="card-header">
                <h5 className="mb-0">{passagemEdicao ? '✏️ Editar Passagem' : '➕ Nova Solicitação de Passagem'}</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Nome do solicitante *</label>
                            <input
                                type="text"
                                name="solicitanteNome"
                                className="form-control"
                                value={formData.solicitanteNome}
                                onChange={handleChange}
                                placeholder="Ex: João Silva"
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Registro / Matrícula *</label>
                            <input
                                type="text"
                                name="solicitanteRegistro"
                                className="form-control"
                                value={formData.solicitanteRegistro}
                                onChange={handleChange}
                                placeholder="Ex: 12345"
                                required
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Destino *</label>
                            <input
                                type="text"
                                name="destino"
                                className="form-control"
                                value={formData.destino}
                                onChange={handleChange}
                                placeholder="Ex: São Paulo"
                                required
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">Motivo da Viagem</label>
                            <input
                                type="text"
                                name="motivo"
                                className="form-control"
                                value={formData.motivo}
                                onChange={handleChange}
                                placeholder="Ex: Reunião com cliente"
                            />
                        </div>
                    </div>

                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary">
                            {passagemEdicao ? '💾 Atualizar' : '✅ Enviar Solicitação'}
                        </button>
                        {passagemEdicao && (
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

export default PassagemForm;