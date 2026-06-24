import React, { useState, useEffect } from 'react';
import { hotelService, colaboradorService } from '../services/api';
import { toast } from 'react-toastify';

function HotelForm({ onSucesso, hotelEdicao, onCancelar, isAdmin }) {
    const [colaboradores, setColaboradores] = useState([]);
    const [colaboradorTexto, setColaboradorTexto] = useState('');

    const [formData, setFormData] = useState(
        hotelEdicao
            ? {
                  registro: hotelEdicao.colaborador?.registro || '',
                  dataEntrada: hotelEdicao.dataEntrada || '',
                  dataSaida: hotelEdicao.dataSaida || '',
                  motivo: hotelEdicao.motivo || '',
                  valor: hotelEdicao.valor || ''
              }
            : {
                  registro: '',
                  dataEntrada: '',
                  dataSaida: '',
                  motivo: '',
                  valor: ''
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

    const extrairRegistro = (texto) => {
        const match = texto.match(/\(([^)]+)\)/);
        return match ? match[1].trim() : null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let registroFinal = formData.registro;

        if (!isAdmin) {
            registroFinal = extrairRegistro(colaboradorTexto);
            if (!registroFinal) {
                toast.error('❌ Formato inválido. Use: Seu Nome (registro)');
                return;
            }
        }

        const dadosParaEnviar = {
            colaborador: { registro: registroFinal },
            dataEntrada: formData.dataEntrada,
            dataSaida: formData.dataSaida,
            motivo: formData.motivo,
            valor: formData.valor === '' ? null : Number(formData.valor)
        };

        try {
            if (hotelEdicao) {
                await hotelService.atualizar(hotelEdicao.id, dadosParaEnviar);
                toast.success('✅ Reserva atualizada com sucesso!');
            } else {
                await hotelService.cadastrar(dadosParaEnviar);
                toast.success('✅ Solicitação enviada! Aguarde aprovação.');
            }

            setFormData({
                registro: '',
                dataEntrada: '',
                dataSaida: '',
                motivo: '',
                valor: ''
            });
            setColaboradorTexto('');
            onSucesso();
        } catch (error) {
            toast.error(error.response?.data?.mensagem || error.response?.data || '❌ Erro ao salvar reserva');
        }
    };

    return (
        <div className="card mb-4">
            <div className="card-header">
                <h5 className="mb-0">{hotelEdicao ? '✏️ Editar Reserva' : '➕ Cadastrar Nova Reserva'}</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Colaborador *</label>

                            {/* ADMIN vê o select, USER digita */}
                            {isAdmin ? (
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
                            ) : (
                                <>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={colaboradorTexto}
                                        onChange={(e) => setColaboradorTexto(e.target.value)}
                                        placeholder="Ex: João Silva (01)"
                                        required
                                        disabled={!!hotelEdicao}
                                    />
                                    <small className="text-muted">
                                        Digite seu nome e seu registro entre parênteses
                                    </small>
                                </>
                            )}
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">Valor (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                name="valor"
                                className="form-control"
                                value={formData.valor}
                                onChange={handleChange}
                                placeholder="Ex: 850.00"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Data de Entrada *</label>
                            <input
                                type="date"
                                name="dataEntrada"
                                className="form-control"
                                value={formData.dataEntrada}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">Data de Saída *</label>
                            <input
                                type="date"
                                name="dataSaida"
                                className="form-control"
                                value={formData.dataSaida}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12 mb-3">
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