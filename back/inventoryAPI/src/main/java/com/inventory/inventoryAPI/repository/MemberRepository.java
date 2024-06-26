package com.inventory.inventoryAPI.repository;

import com.inventory.inventoryAPI.domain.Member;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    @EntityGraph(attributePaths = {"memberRoles"})
    @Query("select m from Member m where m.username = :username")
    Member getWithRoles(@Param("username") String username);
}
