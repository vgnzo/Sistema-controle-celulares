import React, { useState, useEffect } from 'react';
import { hotelService, colaboradorService } from '../services/api';
import { toast } from 'react-toastify';

function HotelForm({ onSucesso, hotelEdicao, onCancelar, isAdmin }) {
    const [colaboradores, setColaboradores] = useState([]);

    const [formData, setFormData] = useState(
        hotelEdicao
            ? {
                  registro: hotelEdicao.colaborador?.registro || '',
                  motivo: hotelEdicao.motivo || '',
              }
            : {
                  registro: '',
                  motivo: '',
              }
    );

    useEffect(() => {
        if (isAdmin) {
            colaboradorService
                .listarTodos()
                .then((r) => setColaboradores(r.data))
                .catch(() => setColaboradores([]));
        }
    }, [isAdmin]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dadosParaEnviar = {
            colaborador: { registro: formData.registro },
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

            setFormData({ registro: '', motivo: '' });
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
                {isAdmin ? (
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Colaborador *</label>
                            <select
                                name="registro"
                                className="form-select"
                                value={formData.registro}
                                onChange={handleChange}
                                required
                                disabled={!!hotelEdicao}
                            >
                                <option value="">Selecione um colaborador</option>
                                {colaboradores.map((c) => (
                                    <option key={c.registro} value={c.registro}>
                                        {c.nome} ({c.registro})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                ) : (
                    <div className="alert alert-info mb-3">
                        ℹ️ Sua solicitação será vinculada ao seu registro. Caso não esteja cadastrado como colaborador, solicite ao administrador.
                    </div>
                )}

                <form onSubmit={handleSubmit}>
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