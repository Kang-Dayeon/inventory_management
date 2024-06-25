package com.inventory.inventoryAPI.service;

import com.inventory.inventoryAPI.dto.TransactionDTO;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.DecimalFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ExcelReportService {
    public byte[] createExcelReport(List<TransactionDTO> transactionDTOList) throws IOException {
        // .xlsx 형식의 엑셀 파일을 생성하고 조작하는 데 사용
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Sales Report");

        Row headerRow = sheet.createRow(0);
        headerRow.createCell(0).setCellValue("ID");
        headerRow.createCell(1).setCellValue("商品名");
        headerRow.createCell(2).setCellValue("取引数量");
        headerRow.createCell(3).setCellValue("取引金額");
        headerRow.createCell(4).setCellValue("取引日");

        int rowIndex = 1;
        int rowId = 1;
        for(TransactionDTO transactionDTO : transactionDTOList){
            Row row = sheet.createRow(rowIndex++);
            row.createCell(0).setCellValue(rowId++);
            row.createCell(1).setCellValue(transactionDTO.getProductName());
            row.createCell(2).setCellValue(formatQuantity(transactionDTO.getQuantity()));
            row.createCell(3).setCellValue(formatTotalPrice(transactionDTO.getTotalPrice()));
            row.createCell(4).setCellValue(formatTransactionDate(transactionDTO.getTransactionDate()));
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        workbook.write(outputStream);
        workbook.close();
        return outputStream.toByteArray();
    }

    private String formatQuantity(int quantity) {
        return quantity + "個";
    }

    private String formatTotalPrice(double totalPrice) {
        DecimalFormat df = new DecimalFormat("#,###");
        return df.format(totalPrice) + "円";
    }

    private String formatTransactionDate(LocalDateTime transactionDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");
        return formatter.format(transactionDate);
    }


}
