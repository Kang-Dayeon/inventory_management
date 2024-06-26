package com.inventory.inventoryAPI.repository;

import com.inventory.inventoryAPI.domain.Member;
import com.inventory.inventoryAPI.domain.MemberRole;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest
public class MemberRepositoryTests {

    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    public void testInsertMember(){
        Member member = Member.builder()
                .username("admin")
                .password(passwordEncoder.encode("123123123"))
                .email("test@admin.com")
                .build();

        member.addRole(MemberRole.USER);
        member.addRole(MemberRole.ADMIN);

        memberRepository.save(member);
    }
}
