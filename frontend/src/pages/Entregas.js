import React, { useState } from 'react';
import EntregaLista from '../components/EntregaLista'
import EntregaForm from '../components/EntregaForm';

function Entregas() {
    const [atualizarLista, setAtualizarLista] = useState(0);
    const [entregaEdicao, setEntregaEdicao] = useState (null);
    const [mostrarForm, setMostrarForm] = useState(false);



  const handleSucesso = () => {
    setAtualizarLista(atualizarLista + 1);
    setEntregaEdicao(null);
    setMostrarForm(false);
  };

  const handleEditar = (entrega) => {
    setEntregaEdicao(entrega);
    setMostrarForm(true);
  };

  const handleCancelar = () => {
    setEntregaEdicao(null);
    setMostrarForm(false);
  };

  const handleNovo = () => {
    setEntregaEdicao(null);
    setMostrarForm(true);
  };

return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📦 Gerenciamento de Entregas</h2>
        <button 
          onClick={handleNovo}
          className="btn btn-success btn-lg"
        >
          ➕ Nova Entrega
        </button>
      </div>

      {mostrarForm && (
        <EntregaForm 
          onSucesso={handleSucesso}
          entregaEdicao={entregaEdicao}
          onCancelar={handleCancelar}
        />
      )}

      <EntregaLista 
        key={atualizarLista}
        onEditar={handleEditar}
      />
    </div>
  );
}

export default Entregas;