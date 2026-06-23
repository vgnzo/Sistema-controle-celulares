import React, { useState } from 'react';
import ComputadorLista from '../components/ComputadorLista';
import ComputadorForm from '../components/ComputadorForm';

function Computadores({ tipo }) { // ✅ recebe tipo
    const [atualizarLista, setAtualizarLista] = useState(0);
    const [computadorEdicao, setComputadorEdicao] = useState(null);
    const [mostrarForm, setMostrarForm] = useState(false);

    const handleSucesso = () => {
        setAtualizarLista(atualizarLista + 1);
        setComputadorEdicao(null);
        setMostrarForm(false);
    };

    const handleEditar = (computador) => {
        if (tipo !== 'ADMIN') return; // ✅ bloqueia USER
        setComputadorEdicao(computador);
        setMostrarForm(true);
    };

    const handleCancelar = () => {
        setComputadorEdicao(null);
        setMostrarForm(false);
    };

    const handleNovo = () => {
        if (tipo !== 'ADMIN') return; // ✅ bloqueia USER
        setComputadorEdicao(null);
        setMostrarForm(true);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>💻 Gerenciamento de Computadores</h2>

                {/* ✅ Só ADMIN vê botão */}
                {tipo === 'ADMIN' && (
                    <button
                        onClick={handleNovo}
                        className="btn btn-success btn-lg"
                    >
                        ➕ Novo Computador
                    </button>
                )}
            </div>

            {/* ✅ Só ADMIN pode abrir formulário */}
            {mostrarForm && tipo === 'ADMIN' && (
                <ComputadorForm
                    onSucesso={handleSucesso}
                    computadorEdicao={computadorEdicao}
                    onCancelar={handleCancelar}
                />
            )}

            {/* Lista sempre aparece (USER pode visualizar) */}
            <ComputadorLista
                key={atualizarLista}
                onEditar={tipo === 'ADMIN' ? handleEditar : null} // ✅ USER não edita
            />
        </div>
    );
}

export default Computadores;