package com.inventory.inventoryAPI.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
    private Long productId;
    private String name;
    private String description;
    private int price;
    private int quantity;
    private SupplierDTO supplier;
    private List<String> imageList;
    private LocalDateTime createdAt;
}
