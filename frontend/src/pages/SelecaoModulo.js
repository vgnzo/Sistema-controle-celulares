import React, { useState, useEffect } from 'react';
import { celularService, computadorService } from '../services/api';

function SelecaoModulo({ onSelecionar, username, onLogout }) {
    const [qtdCelulares, setQtdCelulares] = useState(null);
    const [qtdComputadores, setQtdComputadores] = useState(null);

    useEffect(() => {
        // busca a contagem de cada módulo (se falhar, só não mostra o número)
        celularService.listarTodos()
            .then(r => setQtdCelulares(r.data.length))
            .catch(() => setQtdCelulares(null));

        computadorService.listarTodos()
            .then(r => setQtdComputadores(r.data.length))
            .catch(() => setQtdComputadores(null));
    }, []);

    // estilos reutilizados nos dois cards
    const cardBase = {
        width: '300px',
        cursor: 'pointer',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(10px)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        overflow: 'hidden'
    };

    const onEnter = (e, cor) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = `0 12px 30px ${cor}`;
        e.currentTarget.style.borderColor = cor.replace('0.35', '0.6');
    };
    const onLeave = (e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
    };

    return (
        <div
            className="min-vh-100 d-flex flex-column justify-content-center align-items-center"
            style={{ background: 'linear-gradient(135deg, #0f1117 0%, #1a1f2e 100%)' }}
        >
            <div className="text-center mb-5">
                <h1 className="text-white mb-2" style={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
                    🏢 Sistema de Controle de Ativos
                </h1>
                <p className="text-secondary fs-5">
                    Olá, <span className="text-white">{username}</span>! Qual sistema você quer acessar?
                </p>
            </div>

            <div className="d-flex gap-4 flex-wrap justify-content-center px-3">

                {/* Card Celulares */}
                <div
                    style={cardBase}
                    onClick={() => onSelecionar('celular')}
                    onMouseEnter={(e) => onEnter(e, 'rgba(13,110,253,0.35)')}
                    onMouseLeave={onLeave}
                >
                    <div style={{ height: '6px', background: 'linear-gradient(90deg, #0d6efd, #6ea8fe)' }}></div>
                    <div className="card-body text-center py-5 px-4">
                        <div
                            className="d-inline-flex align-items-center justify-content-center mb-3"
                            style={{
                                width: '90px', height: '90px', borderRadius: '50%',
                                background: 'rgba(13,110,253,0.15)', fontSize: '3rem'
                            }}
                        >
                            📱
                        </div>
                        <h3 className="text-white mb-2">Celulares</h3>
                        <p className="text-secondary mb-3">Gerenciar celulares, chips e entregas</p>
                        <div className="mb-4">
                            {qtdCelulares !== null ? (
                                <span className="badge bg-primary fs-6 px-3 py-2">
                                    {qtdCelulares} {qtdCelulares === 1 ? 'aparelho' : 'aparelhos'}
                                </span>
                            ) : (
                                <span className="badge bg-secondary px-3 py-2">—</span>
                            )}
                        </div>
                        <button className="btn btn-primary btn-lg w-100">Acessar →</button>
                    </div>
                </div>

                {/* Card Computadores */}
                <div
                    style={cardBase}
                    onClick={() => onSelecionar('computador')}
                    onMouseEnter={(e) => onEnter(e, 'rgba(25,135,84,0.35)')}
                    onMouseLeave={onLeave}
                >
                    <div style={{ height: '6px', background: 'linear-gradient(90deg, #198754, #75b798)' }}></div>
                    <div className="card-body text-center py-5 px-4">
                        <div
                            className="d-inline-flex align-items-center justify-content-center mb-3"
                            style={{
                                width: '90px', height: '90px', borderRadius: '50%',
                                background: 'rgba(25,135,84,0.15)', fontSize: '3rem'
                            }}
                        >
                            💻
                        </div>
                        <h3 className="text-white mb-2">Computadores</h3>
                        <p className="text-secondary mb-3">Gerenciar computadores da empresa</p>
                        <div className="mb-4">
                            {qtdComputadores !== null ? (
                                <span className="badge bg-success fs-6 px-3 py-2">
                                    {qtdComputadores} {qtdComputadores === 1 ? 'máquina' : 'máquinas'}
                                </span>
                            ) : (
                                <span className="badge bg-secondary px-3 py-2">—</span>
                            )}
                        </div>
                        <button className="btn btn-success btn-lg w-100">Acessar →</button>
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