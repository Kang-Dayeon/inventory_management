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
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Log4j2
@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final S3UploadService s3UploadService;
    private final InventoryRepository inventoryRepository;
    private final SupplierRepository supplierRepository;

    // get one
    public ProductDTO getOne(Long productId){
        List<Object[]> result = productRepository.getProductWithSupplier(productId);

        if (result == null || result.isEmpty()) {
            throw new IllegalArgumentException("Product not found with id: " + productId);
        }

        Product product = (Product) result.get(0)[0];
        Supplier supplier = (Supplier) result.get(0)[1];

        return entityToDto(product, supplier);
    }

    // get list
    @Transactional
    public PageResponseDTO<ProductDTO> getList(PageRequestDTO pageRequestDTO){
        Pageable pageable = PageRequest.of(pageRequestDTO.getPage() -1,
                pageRequestDTO.getSize(),
                Sort.by("productId").descending());

        Page<Object[]> result = productRepository.selectList(pageable);

        List<ProductDTO> dtoList = result.get().map(arr -> {
            ProductDTO productDTO = null;

            Product product = (Product) arr[0];
            ProductImage productImage = (ProductImage) arr[1];
            Integer quantity = (Integer) arr[2];
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
                    .supplierId(supplierDTO.getSupplierId())
                    .build();

            String imageStr = productImage.getImageUrl();
            productDTO.setUploadFileName(List.of(imageStr));

            return productDTO;
        }).collect(Collectors.toList());

        long totalCount = result.getTotalElements();

        return PageResponseDTO.<ProductDTO>withAll()
                .dtoList(dtoList)
                .totalCount(totalCount)
                .pageRequestDTO(pageRequestDTO)
                .build();
    }

    public List<ProductDTO> getAllList(){
        List<Product> result = productRepository.selectAllList();

        return result.stream().map(this::entityToDtoOnlyProduct).collect(Collectors.toList());
    }

    // modify
    @Transactional
    public void modifyProduct(Long productId, ProductDTO productDTO) throws IOException {
        Optional<Product> result = productRepository.findById(productId);
        Product product = result.orElseThrow(() -> new NoSuchElementException("Product not found with id: " + productId));

        product.changeName(productDTO.getName());
        product.changeDesc(productDTO.getDescription());
        product.changePrice(productDTO.getPrice());

        List<String> uploadFileNames = productDTO.getUploadFileName();

        List<String> existingImageUrls = product.getImageList().stream()
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());

        if(uploadFileNames != null && !uploadFileNames.isEmpty()){
            List<String> imagesToDelete = existingImageUrls.stream()
                    .filter(imageUrl -> !uploadFileNames.contains(imageUrl))
                    .collect(Collectors.toList());

            imagesToDelete.forEach(s3UploadService::deleteFile);

            // 기존 이미지 리스트를 clear하고 유지할 이미지들을 다시 추가
            product.clearList();
            for (String imageUrl : uploadFileNames) {
                product.addImageString(imageUrl);
            }
        } else {
            existingImageUrls.forEach(s3UploadService::deleteFile);
            product.clearList();
        }

        List<MultipartFile> newImages = productDTO.getFiles();

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

//            newImageUrls.forEach(product::addImageString);
            for (String imageUrl : newImageUrls) {
                product.addImageString(imageUrl);
            }
        }

        // supplier
        Optional<Supplier> supplierResult = supplierRepository.findById(productDTO.getSupplierId());
        Supplier supplier = supplierResult.orElseThrow();
        product.changeSupplier(supplier);

        // inventory
        List<Inventory> inventories = product.getInventories();
        if(!inventories.isEmpty()){
            Inventory inventory = inventories.get(0);
            inventory.changeQuantity(productDTO.getQuantity());
            inventoryRepository.save(inventory);
        }

        productRepository.save(product);
    }

    // create
    @Transactional
    public void createProduct(ProductDTO productDTO) throws IOException {
        Product product = dtoToEntity(productDTO);

        List<String> imageUrls = productDTO.getFiles().stream()
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
                .quantity(productDTO.getQuantity())
                .build();

        saveProduct.getInventories().add(inventory);

        inventoryRepository.save(inventory);
    }

    // delete
    @Transactional
    public void removeProduct(Long productId){
        Optional<Product> result = productRepository.findById(productId);
        Product product = result.orElseThrow();

        product.changeDel(true);

        productRepository.save(product);
    }

    private Product dtoToEntity(ProductDTO productDTO){
        Optional<Supplier> result = supplierRepository.findById(productDTO.getSupplierId());
        Supplier supplier = result.orElseThrow();

        Product product = Product.builder()
                .productId(productDTO.getProductId())
                .name(productDTO.getName())
                .description(productDTO.getDescription())
                .price(productDTO.getPrice())
                .supplier(supplier)
                .build();

        return product;
    }

    // entity => dto
    private ProductDTO entityToDto(Product product, Supplier supplier){
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

        ProductDTO productDTO = ProductDTO.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .createdAt(product.getCreatedAt())
                .quantity(quantity)
                .supplierId(supplierDTO.getSupplierId())
                .build();

        List<ProductImage> imageList = product.getImageList();

        if(imageList == null || imageList.isEmpty()){
            return productDTO;
        }

        List<String> fileUrlList = imageList.stream().map(productImage -> productImage.getImageUrl()).toList();

        productDTO.setUploadFileName(fileUrlList);

        return productDTO;
    }

    // entity => dto
    private ProductDTO entityToDtoOnlyProduct(Product product){
        Optional<Inventory> inventoryOptional = inventoryRepository.findByProduct(product);
        int quantity = inventoryOptional.map(Inventory::getQuantity).orElseThrow();

        ProductDTO productDTO = ProductDTO.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .createdAt(product.getCreatedAt())
                .quantity(quantity)
                .build();

        List<ProductImage> imageList = product.getImageList();

        if(imageList == null || imageList.isEmpty()){
            return productDTO;
        }

        List<String> fileUrlList = imageList.stream().map(productImage -> productImage.getImageUrl()).toList();

        productDTO.setUploadFileName(fileUrlList);

        return productDTO;
    }
}
