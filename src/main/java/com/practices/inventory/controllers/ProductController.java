package com.practices.inventory.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.practices.inventory.entities.Product;
import com.practices.inventory.repositories.ProductRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    
    @Autowired
    ProductRepository productRepository;
    
    @GetMapping("{id}")
    public Product getProductById(@PathVariable Long id){
        Optional<Product> findProduct = productRepository.findById(id);
        Product product = findProduct.get();
        return product;
    }

    @GetMapping
    public List<Product> getProducts(){
        List <Product> products= new ArrayList<>();
        products = productRepository.findAll();
        return products;
    }  

    @PostMapping
    public Product addProduct(@RequestBody Product product){
        productRepository.save(product);
        Optional<Product> findProduct = productRepository.findById(product.getId());
        Product newProduct = findProduct.get();
        return newProduct;
    }

    @PutMapping("{id}")
    public Product updateProduct(@PathVariable Long id,@RequestBody Product product){
        
        Optional<Product> persistFindProduct = productRepository.findById(id);
        Product persistProduct = persistFindProduct.get();
        persistProduct.setName(product.getName());
        persistProduct.setPrice(product.getPrice());
        persistProduct.setQuantity(product.getQuantity());

        productRepository.save(persistProduct);
        return persistProduct;
    }

    @DeleteMapping("{id}")
    public void deleteProductById(@PathVariable Long id){
        productRepository.deleteById(id);
    }

}
