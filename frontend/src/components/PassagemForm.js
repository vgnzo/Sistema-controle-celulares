import React, { useState, useEffect } from 'react';
import { passagemService, colaboradorService } from '../services/api';
import { toast } from 'react-toastify';

function PassagemForm({ onSucesso, passagemEdicao, onCancelar, isAdmin }) {
    const [colaboradores, setColaboradores] = useState([]);

    const [formData, setFormData] = useState(
        passagemEdicao
            ? {
                  registro: passagemEdicao.colaborador?.registro || '',
                  destino: passagemEdicao.destino || '',
                  motivo: passagemEdicao.motivo || '',
              }
            : {
                  registro: '',
                  destino: '',
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

            setFormData({ registro: '', destino: '', motivo: '' });
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
                {/* USER vê aviso, ADMIN vê o select */}
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
                                disabled={!!passagemEdicao}
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