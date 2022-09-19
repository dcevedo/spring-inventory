package com.practices.inventory.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "El nombre del producto no puede ser un numero")
public class ProductMalformedException extends RuntimeException{

    public ProductMalformedException(String message) {
        super(message);
    }
    
}
