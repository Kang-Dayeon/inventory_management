package com.inventory.inventoryAPI.repository;

import com.inventory.inventoryAPI.domain.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
}
