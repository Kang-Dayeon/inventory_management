package com.inventory.inventoryAPI.service;

import com.inventory.inventoryAPI.domain.Supplier;
import com.inventory.inventoryAPI.dto.PageRequestDTO;
import com.inventory.inventoryAPI.dto.PageResponseDTO;
import com.inventory.inventoryAPI.dto.SupplierDTO;
import com.inventory.inventoryAPI.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupplierService {
    private final SupplierRepository supplierRepository;

    public Long getSupplierCount(){
        return supplierRepository.count();
    }

    public SupplierDTO createSupplier(SupplierDTO supplierDTO) throws IOException {
        Supplier supplier = dtoToEntity(supplierDTO);

        supplierRepository.save(supplier);

        return entityToDTO(supplier);
    }

    public SupplierDTO getOne(Long supplierId){
        Optional<Supplier> result = supplierRepository.findById(supplierId);
        Supplier supplier = result.orElseThrow();

        return entityToDTO(supplier);
    }

    public List<SupplierDTO> getAllList(){
        List<Supplier> result = supplierRepository.selectAllList();
        List<SupplierDTO> supplierList = result.stream().map(this::entityToDTO).collect(Collectors.toList());
        return supplierList;
    }

    public PageResponseDTO<SupplierDTO> getList(PageRequestDTO pageRequestDTO){
        Pageable pageable = PageRequest.of(pageRequestDTO.getPage() -1,
                pageRequestDTO.getSize(),
                Sort.by("supplierId").descending());

        Page<Supplier> result = supplierRepository.selectList(pageable);

        List<SupplierDTO> dtoList = result.getContent().stream()
                .map(this::entityToDTO)
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();

        return PageResponseDTO.<SupplierDTO>withAll()
                .dtoList(dtoList)
                .totalCount(totalCount)
                .pageRequestDTO(pageRequestDTO)
                .build();
    }

    public void modifySupplier(SupplierDTO supplierDTO){
        Optional<Supplier> result = supplierRepository.findById(supplierDTO.getSupplierId());
        Supplier supplier = result.orElseThrow();

        supplier.changeName(supplierDTO.getName());
        supplier.changeTel(supplierDTO.getTel());
        supplier.changeEmail(supplierDTO.getEmail());

        supplierRepository.save(supplier);
    }

    public void removeSupplier(Long supplierId){
        Optional<Supplier> result = supplierRepository.findById(supplierId);
        Supplier supplier = result.orElseThrow();

        supplier.changeDel(true);

        supplierRepository.save(supplier);
    }

    private SupplierDTO entityToDTO(Supplier supplier){
        return SupplierDTO.builder()
                .supplierId(supplier.getSupplierId())
                .name(supplier.getName())
                .tel(supplier.getTel())
                .email(supplier.getEmail())
                .build();
    }

    private Supplier dtoToEntity(SupplierDTO supplierDTO){
        return Supplier.builder()
                .supplierId(supplierDTO.getSupplierId())
                .name(supplierDTO.getName())
                .email(supplierDTO.getEmail())
                .tel(supplierDTO.getTel())
                .build();
    }
}
