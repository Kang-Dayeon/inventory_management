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

    public SupplierDTO createSupplier(String name, String tel, String email) throws IOException {
        Supplier supplier = Supplier.builder()
                .name(name)
                .tel(tel)
                .email(email)
                .build();

        supplierRepository.save(supplier);

        return convertToDto(supplier);
    }

    public SupplierDTO getOne(Long supplierId){
        Optional<Supplier> result = supplierRepository.findById(supplierId);
        Supplier supplier = result.orElseThrow();

        return convertToDto(supplier);
    }

    public List<String> getNameList(){
        List<Supplier> suppliers = supplierRepository.findAll();
        return suppliers.stream().map(Supplier::getName).toList();
    }

    public PageResponseDTO<SupplierDTO> getList(PageRequestDTO pageRequestDTO){
        Pageable pageable = PageRequest.of(pageRequestDTO.getPage() -1,
                pageRequestDTO.getSize(),
                Sort.by("supplierId").descending());

        Page<Supplier> result = supplierRepository.selectList(pageable);

        List<SupplierDTO> dtoList = result.getContent().stream()
                .map(this::convertToDto)
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
    }

    public void removeSupplier(Long supplierId){
        Optional<Supplier> result = supplierRepository.findById(supplierId);
        Supplier supplier = result.orElseThrow();

        supplier.changeDel(true);
    }

    private SupplierDTO convertToDto(Supplier supplier){
        return SupplierDTO.builder()
                .name(supplier.getName())
                .tel(supplier.getTel())
                .email(supplier.getEmail())
                .build();
    }
}
