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

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> buscarPorUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }

    public Usuario cadastrar(String username, String senha) {
        if (usuarioRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username já cadastrado");
        }
        Usuario usuario = new Usuario();
        usuario.setUsername(username);
        usuario.setSenha(passwordEncoder.encode(senha));
        usuario.setTipo("USER");
        return usuarioRepository.save(usuario);
    }

    public Usuario promoverParaAdmin(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        usuario.setTipo("ADMIN");
        return usuarioRepository.save(usuario);
    }

    public Usuario rebaixarParaUser(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        usuario.setTipo("USER");
        return usuarioRepository.save(usuario);
    }

    public void deletar(Long id) {
        usuarioRepository.deleteById(id);
    }

    public Optional<Usuario> validarLogin(String username, String password) {
        System.out.println("=== DEBUG LOGIN ===");
        System.out.println("Username: " + username);

        Optional<Usuario> usuario = usuarioRepository.findByUsername(username);
        System.out.println("Encontrado: " + usuario.isPresent());

        if (usuario.isPresent()) {
            boolean match = passwordEncoder.matches(password, usuario.get().getSenha());
            System.out.println("Senha confere: " + match);
            if (match) return usuario;
        }

        return Optional.empty();
    }
}