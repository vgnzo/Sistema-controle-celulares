import React, { useState, useEffect } from 'react';
import { hotelService, colaboradorService } from '../services/api';
import { toast } from 'react-toastify';

function HotelForm({ onSucesso, hotelEdicao, onCancelar }) {
    const [colaboradores, setColaboradores] = useState([]);

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

    // carrega a lista de colaboradores pro select
    useEffect(() => {
        colaboradorService
            .listarTodos()
            .then((r) => setColaboradores(r.data))
            .catch(() => setColaboradores([]));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // monta o objeto no formato que o backend espera (colaborador aninhado)
        const dadosParaEnviar = {
            colaborador: { registro: formData.registro },
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
                toast.success('✅ Reserva cadastrada com sucesso!');
            }

            // limpa o formulário
            setFormData({
                registro: '',
                dataEntrada: '',
                dataSaida: '',
                motivo: '',
                valor: ''
            });

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
                            {hotelEdicao ? '💾 Atualizar' : '✅ Cadastrar'}
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