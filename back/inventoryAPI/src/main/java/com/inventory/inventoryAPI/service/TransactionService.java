package com.inventory.inventoryAPI.service;

import com.inventory.inventoryAPI.domain.Inventory;
import com.inventory.inventoryAPI.domain.Product;
import com.inventory.inventoryAPI.domain.Transaction;
import com.inventory.inventoryAPI.dto.PageRequestDTO;
import com.inventory.inventoryAPI.dto.PageResponseDTO;
import com.inventory.inventoryAPI.dto.TransactionDTO;
import com.inventory.inventoryAPI.repository.InventoryRepository;
import com.inventory.inventoryAPI.repository.ProductRepository;
import com.inventory.inventoryAPI.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final ProductRepository productRepository;
    private final TransactionRepository transactionRepository;
    private final InventoryRepository inventoryRepository;
    private final ExcelReportService excelReportService;
    private final S3UploadService s3UploadService;

    public int getTotalPrice(){
        LocalDateTime oneMonthAgo = LocalDateTime.now().minus(1, ChronoUnit.MONTHS);
        Integer totalPriceSum = transactionRepository.findTotalPriceSum(oneMonthAgo);
        return totalPriceSum != null ? totalPriceSum : 0;
    }

    public PageResponseDTO<TransactionDTO> getList(PageRequestDTO pageRequestDTO){
        Pageable pageable = PageRequest.of(pageRequestDTO.getPage() -1,
                pageRequestDTO.getSize(),
                Sort.by("transactionId").descending());

        Page<Transaction> result = transactionRepository.findAll(pageable);

        List<TransactionDTO> dtoList = result.getContent().stream()
                .map(this::entityToDTO)
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();

        return PageResponseDTO.<TransactionDTO>withAll()
                .dtoList(dtoList)
                .totalCount(totalCount)
                .pageRequestDTO(pageRequestDTO)
                .build();
    }

    public TransactionDTO getOne(Long transactionId){
        Optional<Transaction> result = transactionRepository.findById(transactionId);
        Transaction transaction = result.orElseThrow();

        return entityToDTO(transaction);
    }

    public PageResponseDTO<TransactionDTO> getTransactions(PageRequestDTO pageRequestDTO, Long productId, LocalDateTime startDate, LocalDateTime endDate){
        Pageable pageable = PageRequest.of(pageRequestDTO.getPage() - 1,
                pageRequestDTO.getSize(),
                Sort.by("transactionId"). descending());

        Page<Transaction> result = transactionRepository.findByProductAndDate(pageable, productId, startDate, endDate);

        List<TransactionDTO> dtoList = result.getContent().stream()
                .map(this::entityToDTO)
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();

        return PageResponseDTO.<TransactionDTO>withAll()
                .dtoList(dtoList)
                .totalCount(totalCount)
                .pageRequestDTO(pageRequestDTO)
                .build();
    }

    public String generateAndUploadSalesReport(Long productId, LocalDateTime startDate, LocalDateTime endDate) throws IOException {
        List<Transaction> result = transactionRepository.getSalesReport(productId, startDate, endDate);
        List<TransactionDTO> transactions = result.stream().map(this::entityToDTO).collect(Collectors.toList());
        byte[] reportContent = excelReportService.createExcelReport(transactions);

        String reportFileName;
        if(startDate == null || endDate == null){
            LocalDateTime today = LocalDateTime.now();
            reportFileName = "Sales_Report_" +  today + ".xlsx";
        } else {
            reportFileName = "Sales_Report_" + startDate.toLocalDate() + "_to_" + endDate.toLocalDate() + ".xlsx";
        }

        return s3UploadService.saveReportFile(reportContent, reportFileName, "sales-report");
    }

    @Transactional
    public void createTransaction(Long productId, TransactionDTO transactionDTO){
        Optional<Product> result = productRepository.findById(productId);
        Product product = result.orElseThrow();

        Transaction transaction = Transaction.builder()
                .totalPrice(transactionDTO.getTotalPrice())
                .quantity(transactionDTO.getQuantity())
                .product(product)
                .build();

        List<Inventory> inventories = product.getInventories();
        if(!inventories.isEmpty()){
            Inventory inventory = inventories.get(0);
            inventory.changeQuantity(inventory.getQuantity() - transaction.getQuantity());
            inventoryRepository.save(inventory);
        }

        transactionRepository.save(transaction);
    }

    public void modifyTransaction(TransactionDTO transactionDTO){
        Optional<Transaction> result = transactionRepository.findById(transactionDTO.getTransactionId());
        Transaction transaction = result.orElseThrow();

        transaction.changeQuantity(transactionDTO.getQuantity());

        transactionRepository.save(transaction);
    }

    public void removeTransaction(Long transactionId){
        Optional<Transaction> result = transactionRepository.findById(transactionId);
        Transaction transaction = result.orElseThrow();

        transactionRepository.delete(transaction);
    }

    private TransactionDTO entityToDTO(Transaction transaction){
        return TransactionDTO.builder()
                .transactionId(transaction.getTransactionId())
                .productName(transaction.getProduct().getName())
                .productId(transaction.getProduct().getProductId())
                .totalPrice(transaction.getTotalPrice())
                .quantity(transaction.getQuantity())
                .transactionDate(transaction.getTransactionDate())
                .build();
    }
}
