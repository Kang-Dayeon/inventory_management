package com.inventory.inventoryAPI.domain;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductImage {
    private String imageUrl;

    @Setter
    private int ord; // 순번
}
