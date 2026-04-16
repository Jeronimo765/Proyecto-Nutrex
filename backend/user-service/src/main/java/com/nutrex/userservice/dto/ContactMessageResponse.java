package com.nutrex.userservice.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ContactMessageResponse {
    private Long id;
    private String message;
}
