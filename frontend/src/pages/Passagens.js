import React, { useState } from 'react';
import PassagemForm from '../components/PassagemForm';
import PassagemLista from '../components/PassagemLista';

function Passagens({ tipo }) {
    const isAdmin = tipo === 'ADMIN';

    const [mostrarForm, setMostrarForm] = useState(false);
    const [passagemEdicao, setPassagemEdicao] = useState(null);
    const [recarregar, setRecarregar] = useState(0);

    const handleSucesso = () => {
        setMostrarForm(false);
        setPassagemEdicao(null);
        setRecarregar((r) => r + 1);
    };

    const handleEditar = (passagem) => {
        setPassagemEdicao(passagem);
        setMostrarForm(true);
    };

    const handleCancelar = () => {
        setPassagemEdicao(null);
        setMostrarForm(false);
    };

    const handleNova = () => {
        setPassagemEdicao(null);
        setMostrarForm(true);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>✈️ Passagens</h2>

                {/* ✅ qualquer usuário pode solicitar */}
                {!mostrarForm && (
                    <button className="btn btn-primary" onClick={handleNova}>
                        ➕ Nova Passagem
                    </button>
                )}
            </div>

            {/* ✅ form disponível pra todos, mas edição só admin */}
            {mostrarForm && (
                <PassagemForm
                    onSucesso={handleSucesso}
                    passagemEdicao={passagemEdicao}
                    onCancelar={handleCancelar}
                />
            )}

            {/* onEditar só passa pro admin — user não vê botões de editar/excluir */}
            <PassagemLista
                onEditar={isAdmin ? handleEditar : null}
                recarregar={recarregar}
            />
        </div>
    );
}

export default Passagens;