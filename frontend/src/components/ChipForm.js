import React, { useState } from 'react';
import { chipService } from '../services/api';
import { toast } from 'react-toastify';

function ChipForm({ onSucesso, chipEdicao, onCancelar }) {
    const [formData, setFormData] = useState(chipEdicao || {
        iccid: '',
        numeroLinha: '',
        operadora: '',
        status: 'disponivel'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'iccid') {
            // ICCID: só números, máximo 20 dígitos
            const numeros = value.replace(/\D/g, '').slice(0, 20);
            setFormData({ ...formData, [name]: numeros });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (chipEdicao) {
                await chipService.atualizar(formData.iccid, formData);
                toast.success('✅ Chip atualizado com sucesso!');
            } else {
                await chipService.cadastrar(formData);
                toast.success('✅ Chip cadastrado com sucesso!');
            }

            // limpa formulário
            setFormData({
                iccid: '',
                numeroLinha: '',
                operadora: '',
                status: 'disponivel'
            });

            onSucesso(); // recarrega a lista
        } catch (error) {
            // mostra o erro real vindo do backend (ex: ICCID duplicado, status inválido)
            toast.error(error.response?.data?.mensagem || '❌ Erro ao salvar chip');
        }
    };

    return (
        <div className="card mb-4">
            <div className="card-header">
                <h5 className="mb-0">{chipEdicao ? '✏️ Editar Chip' : '➕ Cadastrar Novo Chip'}</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">ICCID *</label>
                            <input
                                type="text"
                                name="iccid"
                                className="form-control"
                                value={formData.iccid}
                                onChange={handleChange}
                                placeholder="Ex: 8955000012345678901"
                                required
                                disabled={!!chipEdicao}
                            />
                            <small className="text-muted">Número do chip (19 a 20 dígitos)</small>
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">Número da Linha</label>
                            <input
                                type="text"
                                name="numeroLinha"
                                className="form-control"
                                value={formData.numeroLinha}
                                onChange={handleChange}
                                placeholder="Ex: 11987654321"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Operadora</label>
                            <select
                                name="operadora"
                                className="form-select"
                                value={formData.operadora}
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

                        <div className="col-md-6 mb-3">
                            <label className="form-label">Status *</label>
                            <select
                                name="status"
                                className="form-select"
                                value={formData.status}
                                onChange={handleChange}
                                required
                            >
                                <option value="disponivel">🟢 Disponível</option>
                                <option value="em uso">🔵 Em uso</option>
                                <option value="com problema">🟡 Com problema</option>
                                <option value="cancelado">🔴 Cancelado</option>
                            </select>
                        </div>
                    </div>

                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary">
                            {chipEdicao ? '💾 Atualizar' : '✅ Cadastrar'}
                        </button>

                        {chipEdicao && (
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

export default ChipForm;