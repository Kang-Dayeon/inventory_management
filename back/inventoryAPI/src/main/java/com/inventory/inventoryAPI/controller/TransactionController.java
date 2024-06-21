package com.inventory.inventoryAPI.controller;


import com.inventory.inventoryAPI.dto.PageRequestDTO;
import com.inventory.inventoryAPI.dto.PageResponseDTO;
import com.inventory.inventoryAPI.dto.TransactionDTO;
import com.inventory.inventoryAPI.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/transaction")
public class TransactionController {
    private final TransactionService transactionService;

    @PostMapping("/{productId}")
    public void createTransaction(@PathVariable("productId") Long productId, TransactionDTO transactionDTO){
        transactionService.createTransaction(productId, transactionDTO);
    }

    @GetMapping("/")
    public PageResponseDTO<TransactionDTO> list(PageRequestDTO pageRequestDTO){
        return transactionService.getList(pageRequestDTO);
    }
}
