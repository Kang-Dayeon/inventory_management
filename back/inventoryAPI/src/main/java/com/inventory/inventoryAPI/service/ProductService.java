package com.inventory.inventoryAPI.service;

import com.inventory.inventoryAPI.domain.Inventory;
import com.inventory.inventoryAPI.domain.Product;
import com.inventory.inventoryAPI.domain.ProductImage;
import com.inventory.inventoryAPI.dto.PageRequestDTO;
import com.inventory.inventoryAPI.dto.PageResponseDTO;
import com.inventory.inventoryAPI.dto.ProductDTO;
import com.inventory.inventoryAPI.repository.InventoryRepository;
import com.inventory.inventoryAPI.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final S3UploadService s3UploadService;
    private final InventoryRepository inventoryRepository;

    public ProductDTO getOne(Long productId){
        Optional<Product> result = productRepository.findById(productId);
        Product product = result.orElseThrow();

        return convertToDto(product);
    }

    public PageResponseDTO<ProductDTO> getList(PageRequestDTO pageRequestDTO){
        Pageable pageable = PageRequest.of(pageRequestDTO.getPage() -1,
                pageRequestDTO.getSize(),
                Sort.by("productId").descending());

        Page<Object[]> result = productRepository.selectList(pageable);

        List<ProductDTO> dtoList = result.get().map(arr -> {
            ProductDTO productDTO = null;

            Product product = (Product) arr[0];
            ProductImage productImage = (ProductImage) arr[1];

            Optional<Inventory> inventoryOptional = inventoryRepository.findByProduct(product);
            int quantity = inventoryOptional.map(Inventory::getQuantity).orElseThrow();

            productDTO = ProductDTO.builder()
                    .productId(product.getProductId())
                    .name(product.getName())
                    .description(product.getDescription())
                    .price(product.getPrice())
                    .createdAt(product.getCreatedAt())
                    .quantity(quantity)
                    .build();

            String imageStr = productImage.getImageUrl();
            productDTO.setImageList(List.of(imageStr));

            return productDTO;
        }).collect(Collectors.toList());

        long totalCount = result.getTotalElements();

        return PageResponseDTO.<ProductDTO>withAll()
                .dtoList(dtoList)
                .totalCount(totalCount)
                .pageRequestDTO(pageRequestDTO)
                .build();
    }

    @Transactional
    public ProductDTO createProduct(String name, String description, int price, List<MultipartFile> images, int quantity) throws IOException {
        Product product = Product.builder()
                .name(name)
                .description(description)
                .price(price)
                .build();

        List<String> imageUrls = images.stream()
                .map(image -> {
                    try {
                        return s3UploadService.saveFile(image, "product-images");
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                })
                .collect(Collectors.toList());

        imageUrls.forEach(url -> product.addImageString(url));

        Product saveProduct = productRepository.save(product);

        Inventory inventory = Inventory.builder()
                .product(saveProduct)
                .quantity(quantity)
                .build();

        saveProduct.getInventories().add(inventory);

        inventoryRepository.save(inventory);

        return convertToDto(saveProduct);
    }

    private ProductDTO convertToDto(Product product){
        List<String> imageUrls = product.getImageList().stream()
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());

        Optional<Inventory> inventoryOptional = inventoryRepository.findByProduct(product);
        int quantity = inventoryOptional.map(Inventory::getQuantity).orElseThrow();


        return ProductDTO.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .imageList(imageUrls)
                .createdAt(product.getCreatedAt())
                .quantity(quantity)
                .build();
    }
}
