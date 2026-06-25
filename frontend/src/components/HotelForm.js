import React, { useState } from 'react';
import { hotelService } from '../services/api';
import { toast } from 'react-toastify';

function HotelForm({ onSucesso, hotelEdicao, onCancelar }) {
    const [formData, setFormData] = useState(
        hotelEdicao
            ? {
                  solicitanteNome: hotelEdicao.solicitanteNome || '',
                  solicitanteRegistro: hotelEdicao.solicitanteRegistro || '',
                  motivo: hotelEdicao.motivo || '',
              }
            : {
                  solicitanteNome: '',
                  solicitanteRegistro: '',
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
            motivo: formData.motivo,
        };

        try {
            if (hotelEdicao) {
                await hotelService.atualizar(hotelEdicao.id, dadosParaEnviar);
                toast.success('✅ Reserva atualizada com sucesso!');
            } else {
                await hotelService.cadastrar(dadosParaEnviar);
                toast.success('✅ Solicitação enviada! Aguarde aprovação.');
            }

            setFormData({ solicitanteNome: '', solicitanteRegistro: '', motivo: '' });
            onSucesso();
        } catch (error) {
            toast.error(error.response?.data?.mensagem || error.response?.data || '❌ Erro ao salvar reserva');
        }
    };

    return (
        <div className="card mb-4">
            <div className="card-header">
                <h5 className="mb-0">{hotelEdicao ? '✏️ Editar Reserva' : '➕ Nova Solicitação de Hotel'}</h5>
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
                        <div className="col-md-12 mb-3">
                            <label className="form-label">Motivo</label>
                            <input
                                type="text"
                                name="motivo"
                                className="form-control"
                                value={formData.motivo}
                                onChange={handleChange}
                                placeholder="Ex: Hospedagem para reunião"
                            />
                        </div>
                    </div>

                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary">
                            {hotelEdicao ? '💾 Atualizar' : '✅ Enviar Solicitação'}
                        </button>
                        {hotelEdicao && (
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

export default HotelForm;