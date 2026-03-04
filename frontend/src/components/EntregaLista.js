import React, { useState, useEffect } from 'react';
import { entregaService } from '../services/api';

function EntregaLista({ onEditar, tipo }){
    const [entregas, setEntregas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        carregarEntregas();
    }, []);

    const carregarEntregas = async () => {
        try {
            setLoading(true);
            const response = await entregaService.listarTodas();
            setEntregas(response.data);
            setErro(null);
        } catch (error) {
            setErro('Erro ao carregar entregas');
        } finally {
            setLoading(false);
        }
    };

    const handleMudarStatus = async (entrega, novoStatus) => {
        if (window.confirm(`Alterar status para "${novoStatus}"?`)) {
            try {
               await entregaService.atualizar(entrega.id.imei, entrega.id.registro, {
               ...entrega,
                 status: novoStatus
                });
                carregarEntregas();
            } catch (error) {
                alert('Erro ao atualizar status');
           }
      }
    };

    if (loading) return <div className="text-center">Carregando...</div>;
    if (erro) return <div className="alert alert-danger">{erro}</div>

    return (
        <div className="card">
            <div className="card-header">
                <h5 className="mb-0">📦 Lista de Entregas</h5>
            </div>
          <div className="card-body">
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                   <thead className="table-dark">
                          <tr>
                             <th>IMEI</th>
                              <th>Modelo</th>
                               <th>Colaborador</th>
                               <th>Data Entrega</th>
                              <th>Previsão Devolução</th>
                               <th>Status</th>
                               {tipo === 'ADMIN' && <th className="text-center">Ações</th>}
                           </tr>
                       </thead>
                       <tbody>
                           {entregas.length === 0 ? (
                         <tr>
                               <td colSpan={tipo === 'ADMIN' ? 7 : 6} className="text-center text-muted">
                                Nenhuma entrega cadastrada
                             </td>
                         </tr>
                            ) : (
                                entregas.map((entrega) => (
                                   <tr key={`${entrega.id.imei}-${entrega.id.registro}`}>
                                     <td>{entrega.celular?.imei || entrega.id.imei}</td>
                                       <td>{entrega.celular?.modelo || '-'}</td>
                                  <td>{entrega.colaborador?.nome || '-'}</td>
                                        <td>{new Date(entrega.dataEntrega).toLocaleDateString('pt-BR')}</td>
                                        <td>{new Date(entrega.dataPrevistaDevolucao).toLocaleDateString('pt-BR')}</td>
                                        <td>
                                            <span className={`badge ${
                                                entrega.status === 'ativo' ? 'bg-success' :
                                                entrega.status === 'devolvido' ? 'bg-secondary' :
                                                'bg-danger'
                                           }`}>
                                            {entrega.status}
                                         </span>
                                       </td>
                                       {tipo === 'ADMIN' && (
                                         <td className="text-center text-nowrap">
                                           <button
                                       onClick={() => onEditar(entrega)}
                                                    className="btn btn-sm btn-warning me-1"
                                                >
                                                    ✏️ Editar
                                                </button>
                                                <button
                                                    onClick={() => handleMudarStatus(entrega, 'ativo')}
                                                    className="btn btn-sm btn-success me-1"
                                                    disabled={entrega.status === 'ativo'}
                                                >
                                                    ✅ Ativo
                                               </button>
                                            <button
                                            onClick={() => handleMudarStatus(entrega, 'devolvido')}
                                             className="btn btn-sm btn-secondary me-1"
                                                 disabled={entrega.status === 'devolvido'}
                                               >
                                                ↩️ Devolvido
                                              </button>
                                         <button
                                             onClick={() => handleMudarStatus(entrega, 'atrasado')}
                                             className="btn btn-sm btn-danger"
                                             disabled={entrega.status === 'atrasado'}
                                             >
                                               ⚠️ Atrasado
                                               </button>
                                     </td>
                                        )}
                               </tr>
                             ))
                            )}
                    </tbody>
                    </table>
        </div>
            </div>
        </div>
    );
}

export default EntregaLista;