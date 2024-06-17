package com.inventory.inventoryAPI.dto;

import com.inventory.inventoryAPI.domain.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SupplierDTO {
    private Long supplierId;
    private String name;
    private String tel;
    private String email;
}
