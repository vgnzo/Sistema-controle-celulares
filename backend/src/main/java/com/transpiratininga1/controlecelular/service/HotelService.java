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

    // listar todas as reservas
    public List<Hotel> listarTodas() {
        return hotelRepository.findAll();
    }

    // buscar por id
    public Optional<Hotel> buscarPorId(Long id) {
        return hotelRepository.findById(id);
    }

    // buscar por colaborador
    public List<Hotel> buscarPorColaborador(String registro) {
        return hotelRepository.findByColaborador_Registro(registro);
    }

    // cadastrar
    public Hotel cadastrar(Hotel hotel) {

        // valida que veio um colaborador
        if (hotel.getColaborador() == null || hotel.getColaborador().getRegistro() == null) {
            throw new IllegalArgumentException("Colaborador é obrigatório");
        }

        // valida que a data de saída não é antes da entrada
        if (hotel.getDataSaida() != null && hotel.getDataSaida().isBefore(hotel.getDataEntrada())) {
            throw new IllegalArgumentException("Data de saída não pode ser antes da data de entrada");
        }

        return hotelRepository.save(hotel);
    }

    // atualizar
    public Hotel atualizar(Long id, Hotel hotelAtualizado) {
        Hotel existente = hotelRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reserva não encontrada"));

        // valida data
        if (hotelAtualizado.getDataSaida() != null && hotelAtualizado.getDataSaida().isBefore(hotelAtualizado.getDataEntrada())) {
            throw new IllegalArgumentException("Data de saída não pode ser antes da data de entrada");
        }

        // copia os campos
        existente.setColaborador(hotelAtualizado.getColaborador());
        existente.setDataEntrada(hotelAtualizado.getDataEntrada());
        existente.setDataSaida(hotelAtualizado.getDataSaida());
        existente.setMotivo(hotelAtualizado.getMotivo());
        existente.setValor(hotelAtualizado.getValor());

        return hotelRepository.save(existente);
    }

    // deletar
    public void deletar(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reserva não encontrada"));
        hotelRepository.delete(hotel);
    }
}