package com.inventory.inventoryAPI.controller;

import com.inventory.inventoryAPI.dto.PageRequestDTO;
import com.inventory.inventoryAPI.dto.PageResponseDTO;
import com.inventory.inventoryAPI.dto.ProductDTO;
import com.inventory.inventoryAPI.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/product")
public class ProductController {
    private final ProductService productService;

    @GetMapping("/total")
    public Long totalProduct(){
        return productService.getProductCount();
    }

    @PostMapping("/add")
    public void createProduct(ProductDTO productDTO) throws IOException {
        productService.createProduct(productDTO);
    }

    @GetMapping("/{productId}")
    public ProductDTO read(@PathVariable("productId") Long productId) {
        return productService.getOne(productId);
    }

    @GetMapping("/list")
    public PageResponseDTO<ProductDTO> list(PageRequestDTO pageRequestDTO){
        return productService.getList(pageRequestDTO);
    }

    @GetMapping("/search")
    public PageResponseDTO<ProductDTO> searchList(PageRequestDTO pageRequestDTO, String productName){
        return productService.getSearchList(pageRequestDTO, productName);
    }

    @GetMapping("/all")
    public List<ProductDTO> getAll(){
        return productService.getAllList();
    }

    @PutMapping("/{productId}")
    public void modify(@PathVariable Long productId, ProductDTO productDTO) throws IOException {
        productService.modifyProduct(productId, productDTO);
    }

    @DeleteMapping("/{productId}")
    public void remove(@PathVariable("productId") Long productId){
        productService.removeProduct(productId);
    }


}
