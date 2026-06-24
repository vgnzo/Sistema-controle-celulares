import React, { useState } from 'react';
import HotelForm from '../components/HotelForm';
import HotelLista from '../components/HotelLista';

function Hoteis({ tipo }) {
    const isAdmin = tipo === 'ADMIN';

    const [mostrarForm, setMostrarForm] = useState(false);
    const [hotelEdicao, setHotelEdicao] = useState(null);
    const [recarregar, setRecarregar] = useState(0);

    const handleSucesso = () => {
        setMostrarForm(false);
        setHotelEdicao(null);
        setRecarregar((r) => r + 1);
    };

    const handleEditar = (hotel) => {
        setHotelEdicao(hotel);
        setMostrarForm(true);
    };

    const handleCancelar = () => {
        setHotelEdicao(null);
        setMostrarForm(false);
    };

    const handleNova = () => {
        setHotelEdicao(null);
        setMostrarForm(true);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>🏨 Reservas de Hotel</h2>

                {/* ✅ qualquer usuário pode solicitar */}
                {!mostrarForm && (
                    <button className="btn btn-primary" onClick={handleNova}>
                        ➕ Nova Reserva
                    </button>
                )}
            </div>

            {/* ✅ form disponível pra todos, mas edição só admin */}
            {mostrarForm && (
                <HotelForm
                    onSucesso={handleSucesso}
                    hotelEdicao={hotelEdicao}
                    onCancelar={handleCancelar}
                />
            )}

            {/* onEditar só passa pro admin — user não vê botões de editar/excluir */}
            <HotelLista
                onEditar={isAdmin ? handleEditar : null}
                recarregar={recarregar}
            />
        </div>
    );
}

export default Hoteis;