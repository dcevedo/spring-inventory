package com.practices.inventory.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "No existe el producto")
public class ProductNotFoundException extends RuntimeException  {

    public ProductNotFoundException(Long id) {
        super(String.format(String.format("Producto con el id: %s no se encuentra",id)));
    }
    
    public ProductNotFoundException(String message) {
        super(message);
    }
}
