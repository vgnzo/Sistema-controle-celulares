package com.transpiratininga1.controlecelular.service;

import com.transpiratininga1.controlecelular.model.Hotel;
import com.transpiratininga1.controlecelular.repository.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class HotelService {

    @Autowired
    private HotelRepository hotelRepository;

    public List<Hotel> listarTodas() {
        return hotelRepository.findAll();
    }

    public Optional<Hotel> buscarPorId(Long id) {
        return hotelRepository.findById(id);
    }

    public List<Hotel> buscarPorColaborador(String registro) {
        return hotelRepository.findByColaborador_Registro(registro);
    }

    // ✅ NOVO
    public List<Hotel> listarPendentes() {
        return hotelRepository.findByStatus(Hotel.Status.PENDENTE);
    }

    public Hotel cadastrar(Hotel hotel) {
        // colaborador é opcional agora; se vier vazio, zera pra não dar erro de vínculo
        if (hotel.getColaborador() == null || hotel.getColaborador().getRegistro() == null
                || hotel.getColaborador().getRegistro().isBlank()) {
            hotel.setColaborador(null);
        }
        if (hotel.getDataSaida() != null && hotel.getDataEntrada() != null
                && hotel.getDataSaida().isBefore(hotel.getDataEntrada())) {
            throw new IllegalArgumentException("Data de saída não pode ser antes da data de entrada");
        }
        // garante que sempre começa PENDENTE
        hotel.setStatus(Hotel.Status.PENDENTE);
        hotel.setObservacao(null);
        return hotelRepository.save(hotel);
    }

    public Hotel atualizar(Long id, Hotel hotelAtualizado) {
        Hotel existente = hotelRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reserva não encontrada"));

        if (hotelAtualizado.getDataSaida() != null && hotelAtualizado.getDataSaida().isBefore(hotelAtualizado.getDataEntrada())) {
            throw new IllegalArgumentException("Data de saída não pode ser antes da data de entrada");
        }


       existente.setColaborador(hotelAtualizado.getColaborador());
        existente.setSolicitanteNome(hotelAtualizado.getSolicitanteNome());
        existente.setSolicitanteRegistro(hotelAtualizado.getSolicitanteRegistro());
        existente.setDataEntrada(hotelAtualizado.getDataEntrada());
        existente.setDataSaida(hotelAtualizado.getDataSaida());
        existente.setMotivo(hotelAtualizado.getMotivo());
        existente.setValor(hotelAtualizado.getValor());

        return hotelRepository.save(existente);
    }

    // ✅ NOVO
    public Hotel aprovar(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reserva não encontrada"));

        if (hotel.getStatus() != Hotel.Status.PENDENTE) {
            throw new IllegalArgumentException("Somente solicitações pendentes podem ser aprovadas");
        }

        hotel.setStatus(Hotel.Status.APROVADO);
        hotel.setObservacao(null);
        return hotelRepository.save(hotel);
    }

    // ✅ NOVO
    public Hotel rejeitar(Long id, String observacao) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reserva não encontrada"));

        if (hotel.getStatus() != Hotel.Status.PENDENTE) {
            throw new IllegalArgumentException("Somente solicitações pendentes podem ser rejeitadas");
        }

        hotel.setStatus(Hotel.Status.REJEITADO);
        hotel.setObservacao(observacao);
        return hotelRepository.save(hotel);
    }

    public void deletar(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reserva não encontrada"));
        hotelRepository.delete(hotel);
    }
}