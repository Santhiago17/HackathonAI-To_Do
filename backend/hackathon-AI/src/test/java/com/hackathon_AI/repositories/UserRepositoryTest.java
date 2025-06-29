package com.hackathon_AI.repositories;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.hackathon_AI.model.User;

@ExtendWith(MockitoExtension.class)
public class UserRepositoryTest {

    @Mock
    private UserRepository userRepository;

    @Test
    public void shouldSaveUser() {
        User user = new User();
        user.setId(1);
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setBirthDate(LocalDate.of(1990, 1, 1));

        when(userRepository.save(any(User.class))).thenReturn(user);

        User savedUser = userRepository.save(user);

        assertThat(savedUser).isNotNull();
        assertThat(savedUser.getId()).isNotNull();
        assertThat(savedUser.getFirstName()).isEqualTo("John");
        verify(userRepository).save(user);
    }

    @Test
    public void shouldFindUserById() {
        User user = new User();
        user.setId(1);
        user.setFirstName("Jane");
        user.setLastName("Smith");
        user.setBirthDate(LocalDate.of(1985, 5, 15));
        
        when(userRepository.findById(anyInt())).thenReturn(Optional.of(user));

        Optional<User> found = userRepository.findById(1);

        assertThat(found).isPresent();
        assertThat(found.get().getFirstName()).isEqualTo("Jane");
        assertThat(found.get().getLastName()).isEqualTo("Smith");
        verify(userRepository).findById(1);
    }

    @Test
    public void shouldFindUsersByFirstNameContaining() {
        User user1 = new User();
        user1.setId(1);
        user1.setFirstName("Michael");
        user1.setLastName("Johnson");
        user1.setBirthDate(LocalDate.of(1980, 3, 10));

        User user2 = new User();
        user2.setId(2);
        user2.setFirstName("Michelle");
        user2.setLastName("Williams");
        user2.setBirthDate(LocalDate.of(1982, 7, 22));

        User user3 = new User();
        user3.setId(3);
        user3.setFirstName("Robert");
        user3.setLastName("Brown");
        user3.setBirthDate(LocalDate.of(1975, 11, 30));
        
        when(userRepository.findByFirstNameContaining(anyString())).thenReturn(Arrays.asList(user1, user2));

        List<User> users = userRepository.findByFirstNameContaining("Mich");

        assertThat(users).hasSize(2);
        assertThat(users).extracting(User::getFirstName).containsExactlyInAnyOrder("Michael", "Michelle");
        verify(userRepository).findByFirstNameContaining("Mich");
    }

    @Test
    public void shouldFindUsersByLastNameContaining() {
        User user1 = new User();
        user1.setId(1);
        user1.setFirstName("Michael");
        user1.setLastName("Johnson");
        user1.setBirthDate(LocalDate.of(1980, 3, 10));

        User user2 = new User();
        user2.setId(2);
        user2.setFirstName("Michelle");
        user2.setLastName("Williams");
        user2.setBirthDate(LocalDate.of(1982, 7, 22));

        User user3 = new User();
        user3.setId(3);
        user3.setFirstName("Robert");
        user3.setLastName("Brown");
        user3.setBirthDate(LocalDate.of(1975, 11, 30));
        
        when(userRepository.findByLastNameContaining(anyString())).thenReturn(Arrays.asList(user1));

        List<User> users = userRepository.findByLastNameContaining("John");

        assertThat(users).hasSize(1);
        assertThat(users).extracting(User::getLastName).containsExactlyInAnyOrder("Johnson");
        verify(userRepository).findByLastNameContaining("John");
    }
}