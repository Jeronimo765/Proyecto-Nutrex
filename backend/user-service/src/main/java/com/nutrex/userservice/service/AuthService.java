package com.nutrex.userservice.service;

import com.nutrex.userservice.dto.AuthResponse;
import com.nutrex.userservice.dto.LoginRequest;
import com.nutrex.userservice.dto.RegisterRequest;

public interface AuthService {

    AuthResponse login(LoginRequest request);

    AuthResponse register(RegisterRequest request);
}
