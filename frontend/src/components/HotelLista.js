import React, { useState, useEffect } from 'react';
import { hotelService } from '../services/api';
import { toast } from 'react-toastify';

function HotelLista({ onEditar, recarregar }) {
    const [hoteis, setHoteis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

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
        } finally {
            setLoading(false);
        }
    };

    const handleDeletar = async (hotel) => {
        if (!isAdmin) return;
        if (window.confirm(`Excluir a reserva de "${hotel.colaborador?.nome}"?`)) {
            try {
                await hotelService.deletar(hotel.id);
                toast.success('✅ Reserva excluída!');
                carregarHoteis();
            } catch (error) {
                toast.error(error.response?.data?.mensagem || '❌ Erro ao excluir');
            }
        }
    };

    const badgeStatus = (status) => {
        switch (status) {
            case 'APROVADO': return <span className="badge bg-success">✅ Aprovado</span>;
            case 'REJEITADO': return <span className="badge bg-danger">❌ Rejeitado</span>;
            default: return <span className="badge bg-warning text-dark">⏳ Pendente</span>;
        }
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
                                <th>Motivo</th>
                                <th>Status</th>
                                {isAdmin && <th className="text-center">Ações</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {hoteis.length === 0 ? (
                                <tr>
                                    <td colSpan={isAdmin ? '4' : '3'} className="text-center text-muted">
                                        Nenhuma reserva cadastrada
                                    </td>
                                </tr>
                            ) : (
                                hoteis.map((hotel) => (
                                    <tr key={hotel.id}>
                                        <td>{hotel.colaborador?.nome || '-'}</td>
                                        <td>{hotel.motivo || '-'}</td>
                                        <td>{badgeStatus(hotel.status)}</td>
                                        {isAdmin && (
                                            <td className="text-center text-nowrap">
                                                <button onClick={() => onEditar(hotel)} className="btn btn-sm btn-warning me-2">✏️ Editar</button>
                                                <button onClick={() => handleDeletar(hotel)} className="btn btn-sm btn-danger">🗑️ Excluir</button>
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