import React, { useState, useEffect } from 'react';
import { hotelService } from '../services/api';
import { toast } from 'react-toastify';

function HotelLista({ onEditar, recarregar }) {
    const [hoteis, setHoteis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    // detecta se é ADMIN baseado na prop onEditar (igual ComputadorLista)
    const isAdmin = !!onEditar;

    useEffect(() => {
        carregarHoteis();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recarregar]);

    const carregarHoteis = async () => {
        try {
            setLoading(true);
            const response = await hotelService.listarTodas();
            setHoteis(response.data);
            setErro(null);
        } catch (error) {
            setErro('Erro ao carregar reservas');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletar = async (hotel) => {
        if (!isAdmin) return;

        if (window.confirm(`Excluir a reserva de "${hotel.colaborador?.nome}"?`)) {
            try {
                await hotelService.deletar(hotel.id);
                toast.success('✅ Reserva excluída com sucesso!');
                carregarHoteis();
            } catch (error) {
                toast.error(error.response?.data?.mensagem || error.response?.data || '❌ Erro ao excluir');
            }
        }
    };

    // formata valor pra R$ (ex: 850 -> R$ 850,00)
    const formatarValor = (valor) => {
        if (valor === null || valor === undefined) return '-';
        return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    // formata data (ex: 2026-07-10 -> 10/07/2026)
    const formatarData = (data) => {
        if (!data) return '-';
        return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
    };

    // calcula quantas diárias (noites) entre entrada e saída
    const calcularDiarias = (entrada, saida) => {
        if (!entrada || !saida) return '-';
        const d1 = new Date(entrada + 'T00:00:00');
        const d2 = new Date(saida + 'T00:00:00');
        const diff = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
        return diff > 0 ? `${diff} ${diff === 1 ? 'noite' : 'noites'}` : '-';
    };

    if (loading) return <div>Carregando...</div>;
    if (erro) return <div style={{ color: 'red' }}>{erro}</div>;

    return (
        <div className="card">
            <div className="card-header">
                <h5 className="mb-0">🏨 Lista de Reservas de Hotel</h5>
            </div>

            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Colaborador</th>
                                <th>Entrada</th>
                                <th>Saída</th>
                                <th>Diárias</th>
                                <th>Motivo</th>
                                <th>Valor</th>
                                {isAdmin && <th className="text-center">Ações</th>}
                            </tr>
                        </thead>

                        <tbody>
                            {hoteis.length === 0 ? (
                                <tr>
                                    <td colSpan={isAdmin ? '7' : '6'} className="text-center text-muted">
                                        Nenhuma reserva cadastrada
                                    </td>
                                </tr>
                            ) : (
                                hoteis.map((hotel) => (
                                    <tr key={hotel.id}>
                                        <td>{hotel.colaborador?.nome || '-'}</td>
                                        <td>{formatarData(hotel.dataEntrada)}</td>
                                        <td>{formatarData(hotel.dataSaida)}</td>
                                        <td>{calcularDiarias(hotel.dataEntrada, hotel.dataSaida)}</td>
                                        <td>{hotel.motivo || '-'}</td>
                                        <td>{formatarValor(hotel.valor)}</td>

                                        {isAdmin && (
                                            <td className="text-center text-nowrap">
                                                <button
                                                    onClick={() => onEditar(hotel)}
                                                    className="btn btn-sm btn-warning me-2"
                                                >
                                                    ✏️ Editar
                                                </button>

                                                <button
                                                    onClick={() => handleDeletar(hotel)}
                                                    className="btn btn-sm btn-danger"
                                                >
                                                    🗑️ Excluir
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default HotelLista;