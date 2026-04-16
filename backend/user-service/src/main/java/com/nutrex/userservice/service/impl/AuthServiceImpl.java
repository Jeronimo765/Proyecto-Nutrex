package com.nutrex.userservice.service.impl;

import com.nutrex.userservice.dto.AuthResponse;
import com.nutrex.userservice.dto.LoginRequest;
import com.nutrex.userservice.dto.RegisterRequest;
import com.nutrex.userservice.entity.User;
import com.nutrex.userservice.exception.AuthException;
import com.nutrex.userservice.repository.UserRepository;
import com.nutrex.userservice.security.JwtUtil;
import com.nutrex.userservice.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new AuthException(HttpStatus.NOT_FOUND, "El correo no esta registrado"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new AuthException(HttpStatus.UNAUTHORIZED, "La contrasena es incorrecta");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return AuthResponse.builder()
            .token(token)
            .email(user.getEmail())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .uuid(user.getUuid())
            .message("Login exitoso")
            .build();
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AuthException(HttpStatus.CONFLICT, "El correo ya esta registrado");
        }

        User user = User.builder()
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .email(request.getEmail())
            .passwordHash(passwordEncoder.encode(request.getPassword()))
            .phone(request.getPhone())
            .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());

        return AuthResponse.builder()
            .token(token)
            .email(user.getEmail())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .uuid(user.getUuid())
            .message("Registro exitoso")
            .build();
    }
}
