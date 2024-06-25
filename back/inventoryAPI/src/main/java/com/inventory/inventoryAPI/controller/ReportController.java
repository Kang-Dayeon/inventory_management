package com.inventory.inventoryAPI.controller;

import com.inventory.inventoryAPI.dto.TransactionDTO;
import com.inventory.inventoryAPI.service.ExcelReportService;
import com.inventory.inventoryAPI.service.S3UploadService;
import com.inventory.inventoryAPI.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {
    private final TransactionService transactionService;

    @GetMapping("/sales")
    public String generateSalesReport(@RequestParam(required = false) Long productId,
                                      @RequestParam(required = false) String dateRange) throws IOException {

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

        return transactionService.generateAndUploadSalesReport(productId, startDate, endDate);
    }
}
