package com.transpiratininga1.controlecelular.config;

import com.transpiratininga1.controlecelular.security.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.http.HttpMethod;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CorsConfigurationSource corsConfigurationSource;
    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(CorsConfigurationSource corsConfigurationSource,
                          JwtAuthFilter jwtAuthFilter) {
        this.corsConfigurationSource = corsConfigurationSource;
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .csrf(csrf -> csrf.disable())
            .httpBasic(basic -> basic.disable())
            .formLogin(form -> form.disable())

            .authorizeHttpRequests(auth -> auth
                // Libera preflight OPTIONS
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Auth público
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/usuarios/register").permitAll()

                // Só ADMIN pode escrever em entregas
                .requestMatchers(HttpMethod.POST, "/api/entregas/**").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/entregas/**").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/entregas/**").hasAuthority("ADMIN")

                // Só ADMIN pode escrever em celulares
                .requestMatchers(HttpMethod.POST, "/api/celulares/**").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/celulares/**").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/celulares/**").hasAuthority("ADMIN")

                // Só ADMIN pode escrever em colaboradores
                .requestMatchers(HttpMethod.POST, "/api/colaboradores/**").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/colaboradores/**").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/colaboradores/**").hasAuthority("ADMIN")

                // Só ADMIN pode gerenciar usuários
                .requestMatchers("/api/usuarios/**").hasAuthority("ADMIN")

                // GET livre para todos autenticados
                .anyRequest().authenticated()
            )

            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}