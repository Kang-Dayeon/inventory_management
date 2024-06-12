package com.inventory.inventoryAPI.service;

import com.inventory.inventoryAPI.domain.Product;
import com.inventory.inventoryAPI.domain.ProductImage;
import com.inventory.inventoryAPI.dto.ProductDTO;
import com.inventory.inventoryAPI.repository.ProductImageRepository;
import com.inventory.inventoryAPI.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final S3UploadService s3UploadService;

    public ProductDTO createProduct(String name, String description, int price, List<MultipartFile> images) throws IOException {
        Product product = Product.builder()
                .name(name)
                .description(description)
                .price(price)
                .build();

        Product saveProduct = productRepository.save(product);

        List<ProductImage> productImages = images.stream()
                .map(image -> {
                    try {
                        String imageUrl = s3UploadService.saveFile(image, "product-images");
                        return ProductImage.builder()
                                .product(saveProduct)
                                .imageUrl(imageUrl)
                                .build();
                    } catch (IOException e){
                        throw new RuntimeException(e);
                    }
                })
                .collect(Collectors.toList());

        productImageRepository.saveAll(productImages);

        saveProduct.setImageList(productImages);

        return convertToDto(saveProduct);
    }

    private ProductDTO convertToDto(Product product){
        List<String> imageUrls = product.getImageList().stream()
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());

        return ProductDTO.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .imageUrls(imageUrls)
                .createdAt(product.getCreatedAt())
                .build();
    }
}
