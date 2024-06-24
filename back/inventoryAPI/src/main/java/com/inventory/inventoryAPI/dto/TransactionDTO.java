package com.inventory.inventoryAPI.dto;

import com.inventory.inventoryAPI.domain.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TransactionDTO {
    private Long transactionId;
    private Long productId;
    private String productName;
    private int quantity;
    private int totalPrice;
    private LocalDateTime transactionDate;
}
