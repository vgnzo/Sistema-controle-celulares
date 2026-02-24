import React, {useState, useEffect} from 'react';
import { celularService } from '../services/api';


function CelularLista( {onEditar}) {
    const [celulares, setCelulares] = useState([]);
    const [loading, setloading] = useState(true);
    const [erro, setErro] = useState(null);


    useEffect(() => {
        carregarCelulares();
    }, []);




    const carregarCelulares = async () => {
        try{
            setloading(true);
            const response = await celularService.listarTodos();
            setCelulares(response.data);
            setErro(null);
        } catch (error) {
            setErro('Erro ao carregar celulares');
            console.error(error);
        } finally {
            setloading(false);
        }
    };


    const handleDeletar = async (imei) => {
        if (window.confirm('Tem certeza que deseja deletar este celular?')){
            try{
                await celularService.deletar(imei);
                carregarCelulares();
            } catch (error)  {
                alert ('Erro ao deletar celular');
            }
        }
    };

    if (loading) return <div>Cerregando...</div>;
    if (erro) return <div style={{color: 'red'}} >{erro}</div>;

   return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">📋 Lista de Celulares</h5>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>IMEI</th>
                <th>Modelo</th>
                <th>Status</th>
                <th>Operadora</th>
                <th>Data Aquisição</th>
                <th>Vida Útil</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {celulares.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    Nenhum celular cadastrado
                  </td>
                </tr>
              ) : (
                celulares.map((celular) => (
                  <tr key={celular.imei}>
                    <td>{celular.imei}</td>
                    <td>{celular.modelo}</td>
                    <td>
                      <span className={`badge ${
                        celular.status === 'em estoque' ? 'bg-success' :
                        celular.status === 'entregue' ? 'bg-primary' :
                        celular.status === 'manutenção' ? 'bg-warning' :
                        'bg-secondary'
                      }`}>
                        {celular.status}
                      </span>
                    </td>
                    <td>{celular.fornecedor || '-'}</td>
                    <td>{new Date(celular.dataAquisicao).toLocaleDateString('pt-BR')}</td>
                    <td>{celular.vidaUtil} meses</td>
                    <td className="text-center">
                      <button 
                        onClick={() => onEditar(celular)}
                        className="btn btn-sm btn-warning me-2"
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        onClick={() => handleDeletar(celular.imei)}
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

export default CelularLista;
    