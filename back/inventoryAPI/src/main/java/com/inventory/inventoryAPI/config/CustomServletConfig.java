package com.inventory.inventoryAPI.config;

import com.inventory.inventoryAPI.controller.formatter.LocalDateFormetter;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CustomServletConfig implements WebMvcConfigurer {
    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addFormatter(new LocalDateFormetter());
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS")
                .allowedOriginPatterns("http://localhost:3000") // Use allowedOriginPatterns
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
