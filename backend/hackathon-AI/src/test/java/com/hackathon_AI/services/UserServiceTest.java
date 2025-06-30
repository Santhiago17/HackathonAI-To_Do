package com.hackathon_AI.services;

import com.hackathon_AI.dto.request.CreateUserDTO;
import com.hackathon_AI.dto.response.UserDTO;
import com.hackathon_AI.model.User;
import com.hackathon_AI.repositories.UserRepository;
import com.hackathon_AI.utils.Converter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private Converter converter;

    @InjectMocks
    private UserService userService;

    private CreateUserDTO createUserDTO;
    private User userEntity;
    private UserDTO userDTO;

    @BeforeEach
    void setUp() {
        createUserDTO = new CreateUserDTO();
        createUserDTO.setFirstName("John");
        createUserDTO.setLastName("Doe");
        createUserDTO.setBirthDate(LocalDate.of(1990, 5, 15));

        userEntity = new User();
        userEntity.setId(1);
        userEntity.setFirstName("John");
        userEntity.setLastName("Doe");
        userEntity.setBirthDate(LocalDate.of(1990, 5, 15));

        userDTO = UserDTO.builder()
                .id(1)
                .firstName("John")
                .lastName("Doe")
                .birthDate(LocalDate.of(1990, 5, 15))
                .build();
    }

    @Test
    void shouldCreateUserSuccessfully() {
        when(converter.convertObject(createUserDTO, User.class)).thenReturn(userEntity);
        when(userRepository.save(userEntity)).thenReturn(userEntity);
        when(converter.convertObject(userEntity, UserDTO.class)).thenReturn(userDTO);

        UserDTO result = userService.createUser(createUserDTO);

        assertNotNull(result);
        assertEquals(userDTO.getId(), result.getId());
        assertEquals(userDTO.getFirstName(), result.getFirstName());
        assertEquals(userDTO.getLastName(), result.getLastName());
        assertEquals(userDTO.getBirthDate(), result.getBirthDate());

        verify(converter, times(1)).convertObject(createUserDTO, User.class);
        verify(userRepository, times(1)).save(userEntity);
        verify(converter, times(1)).convertObject(userEntity, UserDTO.class);
    }

    @Test
    void shouldListAllUsersSuccessfully() {
        List<User> userEntities = Arrays.asList(userEntity, new User());
        userEntities.get(1).setId(2);
        userEntities.get(1).setFirstName("Jane");
        userEntities.get(1).setLastName("Smith");
        userEntities.get(1).setBirthDate(LocalDate.of(1992, 1, 1));

        UserDTO secondUserDTO = UserDTO.builder()
            .id(2)
            .firstName("Jane")
            .lastName("Smith")
            .birthDate(LocalDate.of(1992, 1, 1))
            .build();

        List<UserDTO> userDTOs = Arrays.asList(userDTO, secondUserDTO);

        when(userRepository.findAll()).thenReturn(userEntities);
        when(converter.convertList(userEntities, UserDTO.class)).thenReturn(userDTOs);

        List<UserDTO> result = userService.listAllUsers();

        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(2, result.size());
        assertEquals(userDTOs, result);

        verify(userRepository, times(1)).findAll();
        verify(converter, times(1)).convertList(userEntities, UserDTO.class);
    }

    @Test
    void shouldReturnEmptyListWhenNoUsersExist() {
        List<User> emptyUserList = Collections.emptyList();
        List<UserDTO> emptyUserDTOList = Collections.emptyList();

        when(userRepository.findAll()).thenReturn(emptyUserList);
        when(converter.convertList(emptyUserList, UserDTO.class)).thenReturn(emptyUserDTOList);

        List<UserDTO> result = userService.listAllUsers();

        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(userRepository, times(1)).findAll();
        verify(converter, times(1)).convertList(emptyUserList, UserDTO.class);
    }
}