package com.nutrex.userservice.service;

import com.nutrex.userservice.dto.ContactMessageRequest;
import com.nutrex.userservice.dto.ContactMessageResponse;

public interface ContactMessageService {
    ContactMessageResponse save(ContactMessageRequest request);
}
