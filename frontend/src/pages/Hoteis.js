import React, { useState } from 'react';
import HotelForm from '../components/HotelForm';
import HotelLista from '../components/HotelLista';

function Hoteis({ tipo }) {
    const isAdmin = tipo === 'ADMIN';

    const [mostrarForm, setMostrarForm] = useState(false);
    const [hotelEdicao, setHotelEdicao] = useState(null);
    const [recarregar, setRecarregar] = useState(0);

    // chamado quando cadastra/edita com sucesso
    const handleSucesso = () => {
        setMostrarForm(false);
        setHotelEdicao(null);
        setRecarregar((r) => r + 1); // força a lista a recarregar
    };

    // abre o form pra editar uma reserva
    const handleEditar = (hotel) => {
        setHotelEdicao(hotel);
        setMostrarForm(true);
    };

    // cancela a edição
    const handleCancelar = () => {
        setHotelEdicao(null);
        setMostrarForm(false);
    };

    // abre o form pra cadastrar nova
    const handleNova = () => {
        setHotelEdicao(null);
        setMostrarForm(true);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>🏨 Reservas de Hotel</h2>

                {/* Só ADMIN vê o botão de cadastrar */}
                {isAdmin && !mostrarForm && (
                    <button className="btn btn-primary" onClick={handleNova}>
                        ➕ Nova Reserva
                    </button>
                )}
            </div>

            {/* Form aparece só quando ADMIN clica em Nova/Editar */}
            {isAdmin && mostrarForm && (
                <HotelForm
                    onSucesso={handleSucesso}
                    hotelEdicao={hotelEdicao}
                    onCancelar={handleCancelar}
                />
            )}

            {/* Lista: passa onEditar só se for ADMIN */}
            <HotelLista
                onEditar={isAdmin ? handleEditar : null}
                recarregar={recarregar}
            />
        </div>
    );
}

export default Hoteis;