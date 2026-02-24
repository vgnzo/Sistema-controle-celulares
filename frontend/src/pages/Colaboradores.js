import React, {useState} from 'react';
import ColaboradorLista from '../components/ColaboradorLista';
import ColaboradorForm from '../components/ColaboradorForm';

function Colaboradores(){
    const  [atualizarLista, setAtualizarLista] = useState(0);
  const [colaboradorEdicao, setColaboradorEdicao] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);

  const handleSucesso = () => {
    setAtualizarLista(atualizarLista + 1);
    setColaboradorEdicao(null);
    setMostrarForm(false);
  };

  const handleEditar = (colaborador) => {
    setColaboradorEdicao(colaborador);
    setMostrarForm(true);
  };

  const handleCancelar = () => {
    setColaboradorEdicao(null);
    setMostrarForm(false);
  };

  const handleNovo = () => {
    setColaboradorEdicao(null);
    setMostrarForm(true);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>👥 Gerenciamento de Colaboradores</h2>
        <button 
          onClick={handleNovo}
          className="btn btn-success btn-lg"
        >
          ➕ Novo Colaborador
        </button>
      </div>

      {mostrarForm && (
        <ColaboradorForm 
          onSucesso={handleSucesso}
          colaboradorEdicao={colaboradorEdicao}
          onCancelar={handleCancelar}
        />
      )}

      <ColaboradorLista 
        key={atualizarLista}
        onEditar={handleEditar}
      />
    </div>
  );
}

export default Colaboradores;