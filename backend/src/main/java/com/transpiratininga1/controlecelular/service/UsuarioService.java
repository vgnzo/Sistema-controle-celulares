package com.transpiratininga1.controlecelular.service;

import com.transpiratininga1.controlecelular.model.Usuario;
import com.transpiratininga1.controlecelular.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

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

        // 🔐 Criptografa a senha corretamente
        usuario.setSenha(
            passwordEncoder.encode(usuario.getSenha())
        );

        usuario.setTipo("USER");

        return usuarioRepository.save(usuario);
    }

    // Promover para ADMIN
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

    // 🔐 Validar login corretamente
    public Optional<Usuario> validarLogin(String username, String password) {

        Optional<Usuario> usuario = usuarioRepository.findByUsername(username);

        if (usuario.isPresent()) {
            if (passwordEncoder.matches(password, usuario.get().getSenha())) {
                return usuario;
            }
        }

        return Optional.empty();
    }
}