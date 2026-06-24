import React, { useState } from 'react';
import PassagemForm from '../components/PassagemForm';
import PassagemLista from '../components/PassagemLista';

function Passagens({ tipo }) {
    const isAdmin = tipo === 'ADMIN';

    const [mostrarForm, setMostrarForm] = useState(false);
    const [passagemEdicao, setPassagemEdicao] = useState(null);
    const [recarregar, setRecarregar] = useState(0);

    // chamado quando cadastra/edita com sucesso
    const handleSucesso = () => {
        setMostrarForm(false);
        setPassagemEdicao(null);
        setRecarregar((r) => r + 1); // força a lista a recarregar
    };

    // abre o form pra editar uma passagem
    const handleEditar = (passagem) => {
        setPassagemEdicao(passagem);
        setMostrarForm(true);
    };

    // cancela a edição
    const handleCancelar = () => {
        setPassagemEdicao(null);
        setMostrarForm(false);
    };

    // abre o form pra cadastrar nova
    const handleNova = () => {
        setPassagemEdicao(null);
        setMostrarForm(true);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>✈️ Passagens</h2>

                {/* Só ADMIN vê o botão de cadastrar */}
                {isAdmin && !mostrarForm && (
                    <button className="btn btn-primary" onClick={handleNova}>
                        ➕ Nova Passagem
                    </button>
                )}
            </div>

            {/* Form aparece só quando ADMIN clica em Nova/Editar */}
            {isAdmin && mostrarForm && (
                <PassagemForm
                    onSucesso={handleSucesso}
                    passagemEdicao={passagemEdicao}
                    onCancelar={handleCancelar}
                />
            )}

            {/* Lista: passa onEditar só se for ADMIN (igual teu padrão) */}
            <PassagemLista
                onEditar={isAdmin ? handleEditar : null}
                recarregar={recarregar}
            />
        </div>
    );
}

export default Passagens;