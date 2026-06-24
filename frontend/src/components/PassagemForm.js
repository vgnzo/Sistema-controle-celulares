import React, { useState, useEffect } from 'react';
import { passagemService, colaboradorService } from '../services/api';
import { toast } from 'react-toastify';

function PassagemForm({ onSucesso, passagemEdicao, onCancelar }) {
    const [colaboradores, setColaboradores] = useState([]);

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
                toast.success('✅ Passagem cadastrada com sucesso!');
            }

            // limpa o formulário
            setFormData({
                registro: '',
                destino: '',
                localEmbarque: '',
                dataIda: '',
                dataVolta: '',
                motivo: '',
                valor: ''
            });

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
                            {passagemEdicao ? '💾 Atualizar' : '✅ Cadastrar'}
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