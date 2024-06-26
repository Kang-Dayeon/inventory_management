package com.inventory.inventoryAPI.controller;

import com.inventory.inventoryAPI.util.CustomJWTException;
import com.inventory.inventoryAPI.util.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class APIRefreshController {
    @RequestMapping("/api/member/refresh")
    public Map<String, String> refresh(
            @RequestHeader("Authorization") String authHeader,
            String refreshToken
    ){
      if(authHeader == null){
          throw new CustomJWTException("NULL_REFRESH");
      }

      if(authHeader == null || authHeader.length() < 7){
          throw new CustomJWTException("INVALID STRING");
      }

      String accessToken = authHeader.substring(7);

      if(checkExpiredToken(accessToken) == false){
          return Map.of("accessToken", accessToken, "refreshToken", refreshToken);
      }

      Map<String, Object> claims = JWTUtil.validateToken(refreshToken);

      String newAccessToken = JWTUtil.generateToken(claims, 10);

      String newRefreshToken = checkTime((Integer) claims.get("exp")) == true ? JWTUtil.generateToken(claims, 60 * 24) : refreshToken;

      return Map.of("accessToken", newAccessToken, "refreshToken", newRefreshToken);
    }

    public boolean checkTime(Integer exp){
        java.util.Date expDate = new java.util.Date((long)exp * (1000));

        long gap = expDate.getTime() - System.currentTimeMillis();

        long leftMin = gap / (1000 * 60);

        return leftMin < 60;
    }

    public boolean checkExpiredToken(String token){
        try {
            JWTUtil.validateToken(token);
        }catch (CustomJWTException ex){
            if(ex.getMessage().equals("Expired")){
                return true;
            }
        }

        return false;
    }
}
