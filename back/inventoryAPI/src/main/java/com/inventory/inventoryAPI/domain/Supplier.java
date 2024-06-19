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

    private boolean delFlag;

    public void changeName(String name){
        this.name = name;
    }

    public void changeTel(String tel){
        this.tel = tel;
    }

    public void changeEmail(String email){
        this.email = email;
    }

    public void changeDel(boolean del_flag){
        this.delFlag = del_flag;
    }
}
