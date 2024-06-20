package com.inventory.inventoryAPI.repository;

import com.inventory.inventoryAPI.domain.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    @Query("select s from Supplier s where s.delFlag = false")
    Page<Supplier> selectList(Pageable pageable);

    @Query("select s from Supplier s where s.delFlag = false")
    List<Supplier> selectAllList();
}
