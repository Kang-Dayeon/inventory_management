package com.inventory.inventoryAPI.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Table(name = "Product")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = "imageList")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    private String name;

    private String description;

    private int price;

    private boolean delFlag;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Inventory> inventories = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @ElementCollection
    @Builder.Default
    private List<ProductImage> imageList = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public void changePrice(int price){
        this.price = price;
    }

    public void changeDesc(String description){
        this.description = description;
    }

    public void changeName(String name){
        this.name = name;
    }

    public void changeDel(boolean delFlag){
        this.delFlag = delFlag;
    }

    public void addImage(ProductImage image){
        image.setOrd(imageList.size());
        imageList.add(image);
    }

    public void addImageString(String imageUrl){
        ProductImage productImage = ProductImage.builder().imageUrl(imageUrl).build();
        addImage(productImage);
    }

    public void clearList(){
        this.imageList.clear();
    }
}
