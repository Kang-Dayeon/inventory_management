package com.inventory.inventoryAPI.security;

import com.inventory.inventoryAPI.domain.Member;
import com.inventory.inventoryAPI.dto.MemberDTO;
import com.inventory.inventoryAPI.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Member member = memberRepository.getWithRoles(username);

        if(member == null){
            throw new UsernameNotFoundException("Not Found");
        }

        MemberDTO memberDTO = new MemberDTO(
                member.getUsername(),
                member.getPassword(),
                member.getEmail(),
                member.getMemberRoles()
                        .stream()
                        .map(memberRole -> memberRole.name()).collect(Collectors.toList())
        );

        return memberDTO;
    }
}
