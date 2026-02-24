import React, { useState, useEffect} from 'react';
import { colaboradorService} from '../services/api';


function ColaboradorLista({ onEditar }) {
    const [colaboradores, setColaboradores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);



    useEffect(() => {
        carregarColaboradores();
    }, []);


    const carregarColaboradores = async () => {
        try{
            setLoading(true);
            const response = await colaboradorService.listarTodos();
            setColaboradores(response.data);
            setErro(null);
        } catch (error) {
            setErro('Erro ao carregar Colaboradores');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletar = async (registro) => {
        if(window.confirm('Tem certeza que deseja deletar este colaborador?')){
            try{
                await colaboradorService.deletar(registro);
                carregarColaboradores();
            }catch (error) {
                alert('Erro ao deletar colaborador');
            }
        }
    };

    if (loading) return <div className="text-center">Carregando...</div>;
    if (erro) return <div className="alert alert-danger">{erro}</div>
 
    
     return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">👥 Lista de Colaboradores</h5>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Registro</th>
                <th>Nome</th>
                <th>CPF</th>
                <th>Departamento</th>
                <th>Cargo</th>
                <th>Status</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {colaboradores.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    Nenhum colaborador cadastrado
                  </td>
                </tr>
              ) : (
                colaboradores.map((colaborador) => (
                  <tr key={colaborador.registro}>
                <td>{colaborador.registro}</td>
                <td>{colaborador.nome}</td>
                <td>{colaborador.cpf}</td>
                <td>{colaborador.departamento || '-'}</td>
                <td>{colaborador.cargo || '-'}</td>
                    <td>
                         <span className={`badge ${
                        colaborador.status === 'ativo' ? 'bg-success' : 'bg-secondary'
                      }`}>
                        {colaborador.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <button 
                        onClick={() => onEditar(colaborador)}
                        className="btn btn-sm btn-warning me-2"
                      >
                        ✏️ Editar
                      </button>
                          <button 
                   onClick={() => handleDeletar(colaborador.registro)}
                    className="btn btn-sm btn-danger"
                      >
                      🗑️ Deletar
                  </button>
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

export default ColaboradorLista;
