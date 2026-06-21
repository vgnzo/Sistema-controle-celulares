import React, { useState } from 'react';
import ChipLista from '../components/ChipLista';
import ChipForm from '../components/ChipForm';

function Chips({ tipo }) { // recebe tipo (ADMIN/USER)
    const [atualizarLista, setAtualizarLista] = useState(0);
    const [chipEdicao, setChipEdicao] = useState(null);
    const [mostrarForm, setMostrarForm] = useState(false);

    const handleSucesso = () => {
        setAtualizarLista(atualizarLista + 1);
        setChipEdicao(null);
        setMostrarForm(false);
    };

    const handleEditar = (chip) => {
        if (tipo !== 'ADMIN') return; // bloqueia USER
        setChipEdicao(chip);
        setMostrarForm(true);
    };

    const handleCancelar = () => {
        setChipEdicao(null);
        setMostrarForm(false);
    };

    const handleNovo = () => {
        if (tipo !== 'ADMIN') return; // bloqueia USER
        setChipEdicao(null);
        setMostrarForm(true);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>📶 Gerenciamento de Chips</h2>

                {/* Só ADMIN vê o botão */}
                {tipo === 'ADMIN' && (
                    <button
                        onClick={handleNovo}
                        className="btn btn-success btn-lg"
                    >
                        ➕ Novo Chip
                    </button>
                )}
            </div>

            {/* Só ADMIN pode abrir o formulário */}
            {mostrarForm && tipo === 'ADMIN' && (
                <ChipForm
                    onSucesso={handleSucesso}
                    chipEdicao={chipEdicao}
                    onCancelar={handleCancelar}
                />
            )}

            {/* Lista sempre aparece (USER pode visualizar) */}
            <ChipLista
                key={atualizarLista}
                onEditar={tipo === 'ADMIN' ? handleEditar : null} // USER não edita
            />
        </div>
    );
}

export default Chips;