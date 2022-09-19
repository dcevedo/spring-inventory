package com.practices.inventory.controllers;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.apache.commons.lang3.math.NumberUtils;

import com.practices.inventory.entities.Product;
import com.practices.inventory.exceptions.ProductMalformedException;
import com.practices.inventory.exceptions.ProductNotFoundException;
import com.practices.inventory.repositories.ProductRepository;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    Log logger = LogFactory.getLog(ProductController.class);
    
    @Autowired
    ProductRepository productRepository;
    
    @GetMapping("{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id){
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ProductNotFoundException(id));
        return new ResponseEntity<Product>(product, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<Product>> getProducts(){
        List <Product> products= new ArrayList<>();
        products = productRepository.findAll();
        return new ResponseEntity<List<Product>>(products, HttpStatus.OK);
    }  

    @PostMapping
    public ResponseEntity<Product> addProduct(@RequestBody Product product){
        if(NumberUtils.isDigits(product.getName())){
            throw new ProductMalformedException("el nombre del producto no puede ser un numero");
        }
        productRepository.save(product);
        Product newProduct = productRepository.findById(product.getId())
            .orElseThrow(() -> new ProductNotFoundException("Producto creado no fue encontrado"));

        return new ResponseEntity<Product>(newProduct, HttpStatus.CREATED);
    }

    @PutMapping("{id}")
    public Product updateProduct(@PathVariable Long id,@RequestBody Product product){
        if(NumberUtils.isDigits(product.getName())){
            throw new ProductMalformedException("el nombre del producto no puede ser un numero");
        }
        Product persistProduct = productRepository.findById(id)
            .orElseThrow(() -> new ProductNotFoundException(id));
        persistProduct.setName(product.getName());
        persistProduct.setPrice(product.getPrice());
        persistProduct.setQuantity(product.getQuantity());

        productRepository.save(persistProduct);
        return persistProduct;
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteProductById(@PathVariable Long id){
        try{
            productRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);            
        }catch(Exception e){
            throw new ProductNotFoundException(id);
        }
    }

}
