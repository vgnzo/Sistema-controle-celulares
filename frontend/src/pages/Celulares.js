import React, { useState } from 'react';
import CelularLista from '../components/CelularLista';
import CelularForm from '../components/CelularForm';

function Celulares({ tipo }) { // ✅ recebe tipo
    const [atualizarLista, setAtualizarLista] = useState(0);
    const [celularEdicao, setCelularEdicao] = useState(null);
    const [mostrarForm, setMostrarForm] = useState(false);

    const handleSucesso = () => {
        setAtualizarLista(atualizarLista + 1);
        setCelularEdicao(null);
        setMostrarForm(false);
    };

    const handleEditar = (celular) => {
        if (tipo !== 'ADMIN') return; // ✅ bloqueia USER
        setCelularEdicao(celular);
        setMostrarForm(true);
    };

    const handleCancelar = () => {
        setCelularEdicao(null);
        setMostrarForm(false); // 🔥 aqui estava errado (estava true)
    };

    const handleNovo = () => {
        if (tipo !== 'ADMIN') return; // ✅ bloqueia USER
        setCelularEdicao(null);
        setMostrarForm(true);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>📱 Gerenciamento de Celulares</h2>

                {/* ✅ Só ADMIN vê botão */}
                {tipo === 'ADMIN' && (
                    <button 
                        onClick={handleNovo}
                        className="btn btn-success btn-lg"
                    >
                        ➕ Novo Celular
                    </button>
                )}
            </div>

            {/* ✅ Só ADMIN pode abrir formulário */}
            {mostrarForm && tipo === 'ADMIN' && (
                <CelularForm 
                    onSucesso={handleSucesso}
                    celularEdicao={celularEdicao}
                    onCancelar={handleCancelar}
                />
            )}

            {/* Lista sempre aparece (USER pode visualizar) */}
            <CelularLista 
                key={atualizarLista}
                onEditar={tipo === 'ADMIN' ? handleEditar : null} // ✅ USER não edita
            />
        </div>
    );
}

export default Celulares;