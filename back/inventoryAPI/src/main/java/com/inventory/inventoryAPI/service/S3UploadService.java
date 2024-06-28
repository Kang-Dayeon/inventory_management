package com.inventory.inventoryAPI.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Log4j2
@Service
@RequiredArgsConstructor
public class S3UploadService {
    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public String saveFile(MultipartFile multipartFile, String dirName) throws IOException {
        String fileName = createFileName(multipartFile.getOriginalFilename(), dirName);

        // 파일의 메타데이터를 설정, 여기서 파일의 크기와 타입을 설정
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(multipartFile.getSize());
        metadata.setContentType(multipartFile.getContentType());

        try (InputStream inputStream = multipartFile.getInputStream()) {
            PutObjectRequest putObjectRequest = new PutObjectRequest(bucket, fileName, inputStream, metadata)
                    .withCannedAcl(CannedAccessControlList.PublicRead); // 업로드된 파일을 공개로 설정
            amazonS3.putObject(putObjectRequest);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload file", e);
        }

        return amazonS3.getUrl(bucket, fileName).toString();
    }

    public String saveReportFile(byte[] fileContent, String reportFileName, String dirName) throws IOException {
        String fileName = createFileName(reportFileName, dirName);

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(fileContent.length);
        metadata.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        try (InputStream inputStream = new ByteArrayInputStream(fileContent)){
            PutObjectRequest putObjectRequest = new PutObjectRequest(bucket, fileName, inputStream, metadata)
                    .withCannedAcl(CannedAccessControlList.PublicRead);

            amazonS3.putObject(putObjectRequest);
        } catch (IOException e){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload file", e);
        }

        return amazonS3.getUrl(bucket, fileName).toString();
    }

    public void deleteFile(String fileUrl){
        try {
            // URL에서 버킷 키만 추출하고 디코딩
            // fileUrl = https://dy-inventory-bucket.s3.ap-northeast-1.amazonaws.com/product-images/ad34b92a-bf8f-4a07-a258-2e0ede2e9b66-KakaoTalk_Photo_2024-06-28-14-25-40%20003.jpeg
            // URL 객체를 생성하면, 문자열로 표현된 URL을 분석하고 URL의 구성 요소에 접근
            URL url = new URL(fileUrl);
            String key = url.getPath().substring(1); // https://dy-inventory-bucket.s3.ap-northeast-1.amazonaws.com/ 제거

            // key = product-images/ad34b92a-bf8f-4a07-a258-2e0ede2e9b66-KakaoTalk_Photo_2024-06-28-14-25-40 003.jpeg
            key = URLDecoder.decode(key, StandardCharsets.UTF_8.toString());

            log.info("Extracted key: " + key);

            DeleteObjectRequest deleteObjectRequest = new DeleteObjectRequest(bucket, key);
            amazonS3.deleteObject(deleteObjectRequest);
            log.info("File deleted successfully: " + key);
        } catch (Exception e){
            log.error("Failed to delete file: " + fileUrl, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "fail file delete", e);
        }
    }

    private String createFileName(String originalFileName, String dirName) {
        return dirName + "/" + UUID.randomUUID() + "-" + originalFileName;
    }
}
