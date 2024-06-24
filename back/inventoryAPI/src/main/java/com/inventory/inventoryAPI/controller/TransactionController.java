package com.inventory.inventoryAPI.controller;


import com.inventory.inventoryAPI.dto.PageRequestDTO;
import com.inventory.inventoryAPI.dto.PageResponseDTO;
import com.inventory.inventoryAPI.dto.TransactionDTO;
import com.inventory.inventoryAPI.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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

    @GetMapping("/{transactionId}")
    public TransactionDTO getOne(@PathVariable("transactionId") Long transactionId){
        return transactionService.getOne(transactionId);
    }

    @DeleteMapping("/{transactionId}")
    public void remove(@PathVariable("transactionId") Long transactionId){
        transactionService.removeTransaction(transactionId);
    }

    @PutMapping("/{transactionId}")
    public void modify(TransactionDTO transactionDTO){
        transactionService.modifyTransaction(transactionDTO);
    }

    @GetMapping("/search")
    public PageResponseDTO<TransactionDTO> getTransactions(
            PageRequestDTO pageRequestDTO,
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false) String dateRange){

        LocalDateTime startDate = null;
        LocalDateTime endDate = LocalDateTime.now();

        if("week".equals(dateRange)){
            startDate = endDate.minusWeeks(1);
        } else if ("month".equals(dateRange)) {
            startDate = endDate.minusMonths(1);
        } else if ("year".equals(dateRange)) {
            startDate = endDate.minusYears(1);
        } else {
            endDate = null;
        }

        return transactionService.getTransactions(pageRequestDTO, productId, startDate, endDate);
    }
}
