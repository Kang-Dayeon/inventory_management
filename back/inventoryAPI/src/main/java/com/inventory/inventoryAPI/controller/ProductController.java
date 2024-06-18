package com.inventory.inventoryAPI.controller;

import com.inventory.inventoryAPI.dto.PageRequestDTO;
import com.inventory.inventoryAPI.dto.PageResponseDTO;
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
                                    @RequestPart("images")List<MultipartFile> images,
                                    @RequestParam("quantity") int quantity,
                                    @RequestParam("supplierName") String supplierName) throws IOException {
        return productService.createProduct(name, description, price, images, quantity, supplierName);
    }

    @GetMapping("/{productId}")
    public ProductDTO read(@PathVariable("productId") Long productId) {
        return productService.getOne(productId);
    }

    @GetMapping("/")
    public PageResponseDTO<ProductDTO> list(PageRequestDTO pageRequestDTO){
        return productService.getList(pageRequestDTO);
    }

    @PutMapping("/{productId}")
    private ProductDTO modify(@PathVariable("productId") Long productId,
                              @RequestParam("name") String name,
                              @RequestParam("description") String description,
                              @RequestParam("price") int price,
                              @RequestPart("images")List<MultipartFile> images,
                              @RequestParam("uploadImageNames") List<String> uploadImageNames,
                              @RequestParam("quantity") int quantity,
                              @RequestParam("supplierName") String supplierName) throws IOException {

        return productService.modifyProduct(productId,name,description,price,images,uploadImageNames,quantity,supplierName);
    }


}
