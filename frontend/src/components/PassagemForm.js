import React, { useState, useEffect } from 'react';
import { passagemService, colaboradorService } from '../services/api';
import { toast } from 'react-toastify';

function PassagemForm({ onSucesso, passagemEdicao, onCancelar, isAdmin }) {
    const [colaboradores, setColaboradores] = useState([]);
    const [colaboradorTexto, setColaboradorTexto] = useState('');

    const [formData, setFormData] = useState(
        passagemEdicao
            ? {
                  registro: passagemEdicao.colaborador?.registro || '',
                  destino: passagemEdicao.destino || '',
                  localEmbarque: passagemEdicao.localEmbarque || '',
                  dataIda: passagemEdicao.dataIda || '',
                  dataVolta: passagemEdicao.dataVolta || '',
                  motivo: passagemEdicao.motivo || '',
                  valor: passagemEdicao.valor || ''
              }
            : {
                  registro: '',
                  destino: '',
                  localEmbarque: '',
                  dataIda: '',
                  dataVolta: '',
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

    // extrai o registro de dentro dos parênteses: "João Silva (01)" → "01"
    const extrairRegistro = (texto) => {
        const match = texto.match(/\(([^)]+)\)/);
        return match ? match[1].trim() : null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let registroFinal = formData.registro;

        // se for USER, extrai o registro do campo de texto
        if (!isAdmin) {
            registroFinal = extrairRegistro(colaboradorTexto);
            if (!registroFinal) {
                toast.error('❌ Formato inválido. Use: Seu Nome (registro)');
                return;
            }
        }

        const dadosParaEnviar = {
            colaborador: { registro: registroFinal },
            destino: formData.destino,
            localEmbarque: formData.localEmbarque,
            dataIda: formData.dataIda,
            dataVolta: formData.dataVolta === '' ? null : formData.dataVolta,
            motivo: formData.motivo,
            valor: formData.valor === '' ? null : Number(formData.valor)
        };

        try {
            if (passagemEdicao) {
                await passagemService.atualizar(passagemEdicao.id, dadosParaEnviar);
                toast.success('✅ Passagem atualizada com sucesso!');
            } else {
                await passagemService.cadastrar(dadosParaEnviar);
                toast.success('✅ Solicitação enviada! Aguarde aprovação.');
            }

            setFormData({
                registro: '',
                destino: '',
                localEmbarque: '',
                dataIda: '',
                dataVolta: '',
                motivo: '',
                valor: ''
            });
            setColaboradorTexto('');
            onSucesso();
        } catch (error) {
            toast.error(error.response?.data?.mensagem || error.response?.data || '❌ Erro ao salvar passagem');
        }
    };

    return (
        <div className="card mb-4">
            <div className="card-header">
                <h5 className="mb-0">{passagemEdicao ? '✏️ Editar Passagem' : '➕ Cadastrar Nova Passagem'}</h5>
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
                                    disabled={!!passagemEdicao}
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
                                        disabled={!!passagemEdicao}
                                    />
                                    <small className="text-muted">
                                        Digite seu nome e seu registro entre parênteses
                                    </small>
                                </>
                            )}
                        </div>

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
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Local de Embarque</label>
                            <input
                                type="text"
                                name="localEmbarque"
                                className="form-control"
                                value={formData.localEmbarque}
                                onChange={handleChange}
                                placeholder="Ex: Aeroporto de Guarulhos"
                            />
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
                                placeholder="Ex: 1250.50"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Data de Ida *</label>
                            <input
                                type="date"
                                name="dataIda"
                                className="form-control"
                                value={formData.dataIda}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">Data de Volta</label>
                            <input
                                type="date"
                                name="dataVolta"
                                className="form-control"
                                value={formData.dataVolta}
                                onChange={handleChange}
                            />
                            <small className="text-muted">Deixe vazio se for somente ida</small>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12 mb-3">
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