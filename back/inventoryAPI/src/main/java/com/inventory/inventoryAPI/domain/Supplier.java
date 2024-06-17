package com.inventory.inventoryAPI.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Getter
@Table(name = "Supplier")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long supplierId;

    private String name;

    @OneToMany(mappedBy = "supplier", cascade = CascadeType.ALL)
    private List<Product> products;

    private String tel;

    private String email;
}
