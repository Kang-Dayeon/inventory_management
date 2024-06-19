package com.inventory.inventoryAPI.controller;

import com.inventory.inventoryAPI.dto.PageRequestDTO;
import com.inventory.inventoryAPI.dto.PageResponseDTO;
import com.inventory.inventoryAPI.dto.SupplierDTO;
import com.inventory.inventoryAPI.service.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/supplier")
public class SupplierController {
    private final SupplierService supplierService;

    @PostMapping("/add")
    public SupplierDTO createSupplier(@RequestParam("name") String name, @RequestParam("tel") String tel, @RequestParam("email") String email) throws IOException {
        return supplierService.createSupplier(name, tel, email);
    }

    @GetMapping("/{supplierId}")
    public SupplierDTO read(@PathVariable("supplierId") Long supplierId) {
        return supplierService.getOne(supplierId);
    }

    @GetMapping("/")
    public PageResponseDTO<SupplierDTO> list(PageRequestDTO pageRequestDTO){
        return supplierService.getList(pageRequestDTO);
    }

    @GetMapping("/names")
    public List<String> nameList(){
        return supplierService.getNameList();
    }

    @PutMapping("/{supplierId}")
    public void modify(SupplierDTO supplierDTO){
        supplierService.modifySupplier(supplierDTO);
    }

    @DeleteMapping("/{supplierId}")
    public void remove(Long supplierId){
        supplierService.removeSupplier(supplierId);
    }

}
