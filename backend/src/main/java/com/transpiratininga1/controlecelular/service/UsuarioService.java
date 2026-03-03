package com.transpiratininga1.controlecelular.service;

import com.transpiratininga1.controlecelular.model.Usuario;
import com.transpiratininga1.controlecelular.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Listar todos
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    // Buscar por username
    public Optional<Usuario> buscarPorUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }

    // Cadastrar novo usuário
    public Usuario cadastrar(Usuario usuario) {
        if (usuarioRepository.existsByUsername(usuario.getUsername())) {
            throw new IllegalArgumentException("Username já cadastrado");
        }
        // todo novo usuário entra como USER
        usuario.setTipo("USER");
        return usuarioRepository.save(usuario);
    }

    // Promover para ADMIN (só admin pode chamar isso)
    public Usuario promoverParaAdmin(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        usuario.setTipo("ADMIN");
        return usuarioRepository.save(usuario);
    }

    // Rebaixar para USER
    public Usuario rebaixarParaUser(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        usuario.setTipo("USER");
        return usuarioRepository.save(usuario);
    }

    // Deletar usuário
    public void deletar(Long id) {
        usuarioRepository.deleteById(id);
    }

    // Validar login
    public Optional<Usuario> validarLogin(String username, String senha) {
        return usuarioRepository.findByUsername(username)
            .filter(u -> u.getSenha().equals(senha));
    }
}