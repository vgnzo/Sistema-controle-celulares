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

    public Usuario cadastrar(Usuario usuario) {
        if (usuarioRepository.existsByUsername(usuario.getUsername())) {
            throw new IllegalArgumentException("Username já cadastrado");
        }

        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
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

    // 🔐 Validar login com debug detalhado
    public Optional<Usuario> validarLogin(String username, String password) {

        System.out.println("=== DEBUG LOGIN ===");
        System.out.println("Username recebido: [" + username + "]");
        System.out.println("Senha recebida length: " + (password != null ? password.length() : "null"));

        Optional<Usuario> usuario = usuarioRepository.findByUsername(username);

        System.out.println("Usuário encontrado no banco: " + usuario.isPresent());

        if (usuario.isPresent()) {
            String hashNoBanco = usuario.get().getSenha();
            System.out.println("Hash no banco length: " + (hashNoBanco != null ? hashNoBanco.length() : "null"));
            System.out.println("Hash começa com $2: " + (hashNoBanco != null && hashNoBanco.startsWith("$2")));
            System.out.println("Hash (primeiros 20): " + (hashNoBanco != null ? hashNoBanco.substring(0, Math.min(20, hashNoBanco.length())) : "null"));

            // ✅ DIAGNÓSTICO: verifica se o hash parece válido
            if (hashNoBanco == null || hashNoBanco.length() < 59) {
                System.out.println("❌ ERRO: Hash inválido no banco! Comprimento: " + (hashNoBanco != null ? hashNoBanco.length() : 0));
                return Optional.empty();
            }

            if (!hashNoBanco.startsWith("$2a$") && !hashNoBanco.startsWith("$2b$") && !hashNoBanco.startsWith("$2y$")) {
                System.out.println("❌ ERRO: Senha no banco NÃO é BCrypt! Pode estar em texto puro.");
                System.out.println("👉 SOLUÇÃO: Recadastre o usuário via /api/usuarios/register ou use /api/auth/hash/{senha} para gerar o hash e atualizar no banco.");
                return Optional.empty();
            }

            boolean match = passwordEncoder.matches(password, hashNoBanco);
            System.out.println("passwordEncoder.matches() resultado: " + match);

            if (match) {
                System.out.println("✅ Login bem-sucedido para: " + username);
                return usuario;
            } else {
                System.out.println("❌ Senha não confere para: " + username);
            }
        }

        return Optional.empty();
    }
}