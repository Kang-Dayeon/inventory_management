package com.inventory.inventoryAPI.repository;

import com.inventory.inventoryAPI.domain.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("select p, pi, i.quantity, s from Product p " +
            "left join p.imageList pi " +
            "left join p.inventories i " +
            "left join p.supplier s " +
            "where pi.ord = 0 and p.delFlag = false and s.delFlag = false")
    Page<Object[]> selectList(Pageable pageable);

    @Query("select p, s from Product p " +
            "left join p.supplier s " +
            "where p.delFlag = false and s.delFlag = false")
    List<Product> selectAllList();

    @Query("select p, s " +
            "from Product p " +
            "left join Supplier s on p.supplier.supplierId = s.supplierId " +
            "where p.productId = :productId")
    List<Object[]> getProductWithSupplier(@Param("productId") Long productId);
}
