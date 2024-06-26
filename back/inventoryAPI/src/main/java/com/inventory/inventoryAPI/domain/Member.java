package com.inventory.inventoryAPI.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = "memberRoles")
public class Member {
    @Id
    private String username;

    private String password;

    @Column(unique = true)
    private String email;

    @ElementCollection(fetch = FetchType.LAZY)
    @Builder.Default
    private List<MemberRole> memberRoles = new ArrayList<>();

    public void addRole(MemberRole memberRole){
        memberRoles.add(memberRole);
    }

    public void clearRole(){
        memberRoles.clear();
    }

    public void changeEmail(String email){
        this.email = email;
    }

    public void changePassword(String password){
        this.password = password;
    }
}
