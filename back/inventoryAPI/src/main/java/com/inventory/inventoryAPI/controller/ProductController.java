package com.inventory.inventoryAPI.controller;

import com.inventory.inventoryAPI.dto.ProductDTO;
import com.inventory.inventoryAPI.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/product")
public class ProductController {
    private final ProductService productService;

    @PostMapping("/add")
    public ProductDTO createProduct(@RequestParam("name") String name,
                                    @RequestParam("description") String description,
                                    @RequestParam("price") int price,
                                    @RequestPart("images")List<MultipartFile> images) throws IOException {
        return productService.createProduct(name, description, price, images);
    }


}
