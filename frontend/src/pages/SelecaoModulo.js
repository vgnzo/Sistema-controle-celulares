import React from 'react';

function SelecaoModulo({ onSelecionar, username, onLogout }) {
    return (
        <div className="min-vh-100 bg-dark d-flex flex-column justify-content-center align-items-center">
            <div className="text-center mb-5">
                <h1 className="text-white mb-2">🏢 Sistema de Controle de Ativos</h1>
                <p className="text-secondary">Olá, {username}! Qual sistema você quer acessar?</p>
            </div>

            <div className="d-flex gap-4 flex-wrap justify-content-center">

                {/* Card Celulares */}
                <div
                    className="card text-center shadow"
                    style={{ width: '260px', cursor: 'pointer' }}
                    onClick={() => onSelecionar('celular')}
                >
                    <div className="card-body py-5">
                        <div style={{ fontSize: '4rem' }}>📱</div>
                        <h3 className="card-title mt-3">Celulares</h3>
                        <p className="card-text text-muted">
                            Gerenciar celulares, chips e entregas
                        </p>
                        <button className="btn btn-primary mt-2">Acessar</button>
                    </div>
                </div>

                {/* Card Computadores */}
                <div
                    className="card text-center shadow"
                    style={{ width: '260px', cursor: 'pointer' }}
                    onClick={() => onSelecionar('computador')}
                >
                    <div className="card-body py-5">
                        <div style={{ fontSize: '4rem' }}>💻</div>
                        <h3 className="card-title mt-3">Computadores</h3>
                        <p className="card-text text-muted">
                            Gerenciar computadores da empresa
                        </p>
                        <button className="btn btn-primary mt-2">Acessar</button>
                    </div>
                </div>

            </div>

            <button
                className="btn btn-outline-light btn-sm mt-5"
                onClick={onLogout}
            >
                🚪 Sair
            </button>
        </div>
    );
}

export default SelecaoModulo;