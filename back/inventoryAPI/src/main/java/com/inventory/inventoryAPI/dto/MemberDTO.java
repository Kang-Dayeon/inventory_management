package com.inventory.inventoryAPI.dto;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.*;
import java.util.stream.Collectors;

public class MemberDTO extends User {
    private String username;
    private String name;
    private String email;
    private List<String> roleNames = new ArrayList<>();

    public MemberDTO(String username, String password, String name, String email, List<String> roleNames){
        super(
                username,
                password,
                roleNames.stream().map(str -> new SimpleGrantedAuthority("ROLE_"+str)).collect(Collectors.toList()));
        this.username = username;
        this.name = name;
        this.email  = email;
        this.roleNames = roleNames;
    }

    // jwt를 위한 데이터
    public Map<String, Object> getClaims() {
        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("username", username);
        dataMap.put("name", name);
        dataMap.put("email", email);
        dataMap.put("roleNames", roleNames);
        return dataMap;
    }

}
