package com.inventory.inventoryAPI.dto;

import com.inventory.inventoryAPI.domain.Supplier;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
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
    private Long supplierId;
    @Builder.Default
    private List<String> uploadFileName = new ArrayList<>();
    @Builder.Default
    private List<MultipartFile> files = new ArrayList<>();
    private LocalDateTime createdAt;
}
