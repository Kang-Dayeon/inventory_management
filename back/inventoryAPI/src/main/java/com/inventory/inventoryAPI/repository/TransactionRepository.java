package com.inventory.inventoryAPI.repository;

import com.inventory.inventoryAPI.domain.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Page<Transaction> findAll(Pageable pageable);

    @Query("select t from Transaction t " +
            "where (:productId is null or t.product.productId = :productId) " +
            "and (:startDate is null or t.transactionDate >= :startDate) " +
            "and (:endDate is null or t.transactionDate <= :endDate)")
    Page<Transaction> findByProductAndDate(Pageable pageable, Long productId, LocalDateTime startDate, LocalDateTime endDate);

    @Query("select t from Transaction t " +
            "where (:productId is null or t.product.productId = :productId) " +
            "and (:startDate is null or t.transactionDate >= :startDate) " +
            "and (:endDate is null or t.transactionDate <= :endDate)")
    List<Transaction> getSalesReport(Long productId, LocalDateTime startDate, LocalDateTime endDate);

    @Query("select sum(t.totalPrice) from Transaction t")
    Integer findTotalPriceSum();
}
