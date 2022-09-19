package com.practices.inventory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class InventoryApplication extends SpringBootServletInitializer{

	public static void main(String[] args) {
		SpringApplication.run(InventoryApplication.class, args);
	}
/*
 * Implementation of spring app without the embeed tomcat server
 */
	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
		return builder.sources(InventoryApplication.class);
	}

}