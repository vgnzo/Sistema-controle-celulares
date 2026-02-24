import React, { useState } from 'react';
import CelularLista from '../components/CelularLista';
import CelularForm from '../components/CelularForm';

function Celulares() {
    const [atualizarLista, setAtualizarLista] = useState(0);  //cada vez q muda o numero a lista atualiza
    const [celularEdicao, setCelularEdicao] = useState(null); //guarda qual celular esta sendo editado e se for null = modo cadastro novo
    const [mostrarForm, setMostrarForm] = useState (false);

    const handleSucesso = () => {
        setAtualizarLista(atualizarLista + 1); //força a lista recarregar
        setCelularEdicao(null);  //limpa edição
        setMostrarForm(false); //esconde o formulario

    };

    const handleEditar = (celular) => {
        setCelularEdicao(celular);  //preenche o form com dados do celular
        setMostrarForm(true); //mostra o form
    };

    const handleCancelar = () => {
        setCelularEdicao(null); //garante q n tem nada pra editar
        setMostrarForm(true); //mostra o form vazio

    };


    const handleNovo = () => {
        setCelularEdicao(null);
        setMostrarForm (true);
    };

    return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📱 Gerenciamento de Celulares</h2>
        <button 
          onClick={handleNovo}
          className="btn btn-success btn-lg"
        >
          ➕ Novo Celular
        </button>
      </div>

      {mostrarForm && (
        <CelularForm 
          onSucesso={handleSucesso}
          celularEdicao={celularEdicao}
          onCancelar={handleCancelar}
        />
      )}

      <CelularLista 
        key={atualizarLista}
        onEditar={handleEditar}
      />
    </div>
  );
}

export default Celulares;