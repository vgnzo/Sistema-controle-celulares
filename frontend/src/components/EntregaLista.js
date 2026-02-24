import React, { useState, useEffect } from 'react';
import { entregaService } from '../services/api';


function EntregaLista({ onEditar }){
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
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    const handleDeletar = async (imei, registro) => {
        if(window.confirm('Tem certeza que deseja deletar esta entrega?')) {
            try {
                await entregaService.deletar(imei, registro);
                carregarEntregas();
            } catch (error) {
                alert ('Erro ao deletar entrega')
            
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
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {entregas.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
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
                 <td className="text-center">
  <div className="d-flex justify-content-center gap-2">
    
                     <button 
          onClick={() => onEditar(entrega)}
           className="btn btn-sm btn-warning"
            >
               ✏️ Editar
            </button>

            <button 
             onClick={() => handleDeletar(entrega.id.imei, entrega.id.registro)}
              className="btn btn-sm btn-danger"
              >
               🗑️ Deletar
                </button>

              </div>
                </td>
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

