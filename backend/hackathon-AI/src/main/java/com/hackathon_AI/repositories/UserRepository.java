package com.hackathon_AI.repositories;

import com.hackathon_AI.entities.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    // Métodos personalizados se necessário
    List<User> findByFirstNameContaining(String firstName);
    List<User> findByLastNameContaining(String lastName);
}
