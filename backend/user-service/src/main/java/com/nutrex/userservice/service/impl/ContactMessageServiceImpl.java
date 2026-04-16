package com.nutrex.userservice.service.impl;

import com.nutrex.userservice.dto.ContactMessageRequest;
import com.nutrex.userservice.dto.ContactMessageResponse;
import com.nutrex.userservice.entity.ContactMessage;
import com.nutrex.userservice.repository.ContactMessageRepository;
import com.nutrex.userservice.service.ContactMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContactMessageServiceImpl implements ContactMessageService {

    private final ContactMessageRepository contactMessageRepository;

    @Override
    public ContactMessageResponse save(ContactMessageRequest request) {
        ContactMessage contactMessage = ContactMessage.builder()
            .nombre(request.getNombre())
            .email(request.getEmail())
            .motivo(request.getMotivo())
            .mensaje(request.getMensaje())
            .build();

        ContactMessage savedMessage = contactMessageRepository.save(contactMessage);

        return ContactMessageResponse.builder()
            .id(savedMessage.getId())
            .message("Mensaje guardado correctamente")
            .build();
    }
}
