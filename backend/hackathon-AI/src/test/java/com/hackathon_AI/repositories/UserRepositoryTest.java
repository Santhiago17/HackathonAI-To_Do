package com.hackathon_AI.repositories;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import com.hackathon_AI.entities.User;

@DataJpaTest
public class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void shouldSaveUser() {
        // given
        User user = new User();
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setBirthDate(LocalDate.of(1990, 1, 1));

        // when
        User savedUser = userRepository.save(user);

        // then
        assertThat(savedUser).isNotNull();
        assertThat(savedUser.getId()).isNotNull();
        assertThat(savedUser.getFirstName()).isEqualTo("John");
    }

    @Test
    public void shouldFindUserById() {
        // given
        User user = new User();
        user.setFirstName("Jane");
        user.setLastName("Smith");
        user.setBirthDate(LocalDate.of(1985, 5, 15));
        entityManager.persist(user);
        entityManager.flush();

        // when
        Optional<User> found = userRepository.findById(user.getId());

        // then
        assertThat(found).isPresent();
        assertThat(found.get().getFirstName()).isEqualTo("Jane");
        assertThat(found.get().getLastName()).isEqualTo("Smith");
    }

    @Test
    public void shouldFindUsersByFirstNameContaining() {
        // given
        User user1 = new User();
        user1.setFirstName("Michael");
        user1.setLastName("Johnson");
        user1.setBirthDate(LocalDate.of(1980, 3, 10));
        entityManager.persist(user1);

        User user2 = new User();
        user2.setFirstName("Michelle");
        user2.setLastName("Williams");
        user2.setBirthDate(LocalDate.of(1982, 7, 22));
        entityManager.persist(user2);

        User user3 = new User();
        user3.setFirstName("Robert");
        user3.setLastName("Brown");
        user3.setBirthDate(LocalDate.of(1975, 11, 30));
        entityManager.persist(user3);
        
        entityManager.flush();

        // when
        List<User> users = userRepository.findByFirstNameContaining("Mich");

        // then
        assertThat(users).hasSize(2);
        assertThat(users).extracting(User::getFirstName).containsExactlyInAnyOrder("Michael", "Michelle");
    }

    @Test
    public void shouldFindUsersByLastNameContaining() {
        // given
        User user1 = new User();
        user1.setFirstName("Michael");
        user1.setLastName("Johnson");
        user1.setBirthDate(LocalDate.of(1980, 3, 10));
        entityManager.persist(user1);

        User user2 = new User();
        user2.setFirstName("Michelle");
        user2.setLastName("Williams");
        user2.setBirthDate(LocalDate.of(1982, 7, 22));
        entityManager.persist(user2);

        User user3 = new User();
        user3.setFirstName("Robert");
        user3.setLastName("Brown");
        user3.setBirthDate(LocalDate.of(1975, 11, 30));
        entityManager.persist(user3);
        
        entityManager.flush();

        // when
        List<User> users = userRepository.findByLastNameContaining("John");

        // then
        assertThat(users).hasSize(1);
        assertThat(users).extracting(User::getLastName).containsExactlyInAnyOrder("Johnson");
    }

}