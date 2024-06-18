package com.inventory.inventoryAPI.service;

import com.inventory.inventoryAPI.domain.Inventory;
import com.inventory.inventoryAPI.domain.Product;
import com.inventory.inventoryAPI.domain.ProductImage;
import com.inventory.inventoryAPI.domain.Supplier;
import com.inventory.inventoryAPI.dto.*;
import com.inventory.inventoryAPI.repository.InventoryRepository;
import com.inventory.inventoryAPI.repository.ProductRepository;
import com.inventory.inventoryAPI.repository.SupplierRepository;
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
    private final SupplierRepository supplierRepository;

    public ProductDTO getOne(Long productId){
        List<Object[]> result = productRepository.getProductWithSupplier(productId);

        if (result == null || result.isEmpty()) {
            throw new IllegalArgumentException("Product not found with id: " + productId);
        }

        Product product = (Product) result.get(0)[0];
        Supplier supplier = (Supplier) result.get(0)[1];
        List<ProductImageDTO> productImages = product.getImageList().stream()
                .map(this::convertToProductImageDto)
                .collect(Collectors.toList());

        return convertToDto(product, supplier, productImages);
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
            int quantity = (int) arr[2];
            Supplier supplier = (Supplier) arr[3];

            SupplierDTO supplierDTO = supplier != null ?
                    SupplierDTO.builder()
                            .supplierId(supplier.getSupplierId())
                            .name(supplier.getName())
                            .tel(supplier.getTel())
                            .email(supplier.getEmail())
                            .build() :
                    null;

            productDTO = ProductDTO.builder()
                    .productId(product.getProductId())
                    .name(product.getName())
                    .description(product.getDescription())
                    .price(product.getPrice())
                    .createdAt(product.getCreatedAt())
                    .quantity(quantity)
                    .supplier(supplierDTO)
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

    public ProductDTO modifyProduct(Long productId,
                                    String name,
                                    String description,
                                    int price,
                                    List<MultipartFile> newImages,
                                    List<String> uploadImageNames,
                                    int quantity,
                                    String supplierName) throws IOException {

        Optional<Product> result = productRepository.findById(productId);
        Product product = result.orElseThrow();

        product.changeName(name);
        product.changeDesc(description);
        product.changePrice(price);

        if(uploadImageNames != null && uploadImageNames.isEmpty()){
            List<String> existingImageUrls = product.getImageList().stream()
                    .map(ProductImage::getImageUrl)
                    .collect(Collectors.toList());

            List<String> imagesToDelete = existingImageUrls.stream()
                    .filter(imageUrl -> !uploadImageNames.contains(imageUrl))
                    .collect(Collectors.toList());

            imagesToDelete.forEach(s3UploadService::deleteFile);

            // 기존 이미지 리스트를 clear하고 유지할 이미지들을 다시 추가
            product.clearList();
            uploadImageNames.forEach(product::addImageString);
        }

        // 새로운 이미지가 있는 경우
        if (newImages != null && !newImages.isEmpty()) {
            List<String> newImageUrls = newImages.stream()
                    .map(image -> {
                        try {
                            return s3UploadService.saveFile(image, "product-images");
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    })
                    .collect(Collectors.toList());

            // 새로운 이미지를 DTO로 변환
            List<ProductImageDTO> newImageDtos = newImageUrls.stream()
                    .map(url -> {
                        product.addImageString(url);
                        return ProductImageDTO.builder().imageUrl(url).build();
                    })
                    .collect(Collectors.toList());

            // 기존 이미지를 유지할 필요가 없는 경우 리스트 초기화
            if (uploadImageNames == null || uploadImageNames.isEmpty()) {
                product.clearList();
            }

            // 기존 이미지를 유지할 경우 이미지 추가
            if (uploadImageNames != null) {
                uploadImageNames.forEach(product::addImageString);
            }
        }

        if(supplierName != null){
            Optional<Supplier> supplierResult = supplierRepository.findByName(supplierName);
            Supplier supplier = supplierResult.orElseThrow();

            product.changeSupplier(supplier);
        }

        List<Inventory> inventories = product.getInventories();
        if(!inventories.isEmpty()){
            Inventory inventory = inventories.get(0);
            inventory.changeQuantity(quantity);
            inventoryRepository.save(inventory);
        }

        Product updatedProduct = productRepository.save(product);

        if(newImageDtos == null){
            newImageDtos = updatedProduct.getImageList().stream()
                    .map(this::convertToProductImageDto)
                    .collect(Collectors.toList());
        }

        return convertToDto(updatedProduct, updatedProduct.getSupplier(), newImageDtos);
    }

    @Transactional
    public ProductDTO createProduct(String name,
                                    String description,
                                    int price,
                                    List<MultipartFile> images,
                                    int quantity,
                                    String supplierName) throws IOException {

        Optional<Supplier> result = supplierRepository.findByName(supplierName);
        Supplier supplier = result.orElseThrow();

        Product product = Product.builder()
                .name(name)
                .description(description)
                .price(price)
                .supplier(supplier)
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

        List<ProductImageDTO> productImages = imageUrls.stream()
                .map(url -> ProductImageDTO.builder().imageUrl(url).build())
                .collect(Collectors.toList());

        return convertToDto(saveProduct, supplier, productImages);
    }


    private ProductDTO convertToDto(Product product, Supplier supplier, List<ProductImageDTO> productImages){
        Optional<Inventory> inventoryOptional = inventoryRepository.findByProduct(product);
        int quantity = inventoryOptional.map(Inventory::getQuantity).orElseThrow();

        SupplierDTO supplierDTO = supplier != null ?
                SupplierDTO.builder()
                        .supplierId(supplier.getSupplierId())
                        .name(supplier.getName())
                        .tel(supplier.getTel())
                        .email(supplier.getEmail())
                        .build() :
                null;

        return ProductDTO.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .imageList(productImages.stream().map(ProductImageDTO::getImageUrl).collect(Collectors.toList()))
                .createdAt(product.getCreatedAt())
                .quantity(quantity)
                .supplier(supplierDTO)
                .build();
    }

    private ProductImageDTO convertToProductImageDto(ProductImage productImage) {
        return ProductImageDTO.builder()
                .imageUrl(productImage.getImageUrl())
                .ord(productImage.getOrd())
                .build();
    }
}
