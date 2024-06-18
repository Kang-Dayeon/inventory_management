package com.inventory.inventoryAPI.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductImageDTO {
    private String imageUrl;
    private int ord;
}
