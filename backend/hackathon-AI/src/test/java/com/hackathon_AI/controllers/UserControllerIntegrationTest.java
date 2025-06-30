package com.hackathon_AI.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.hackathon_AI.dto.request.CreateUserDTO;
import com.hackathon_AI.dto.response.UserDTO;
import com.hackathon_AI.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@AutoConfigureWebMvc
@ComponentScan("com.hackathon_AI")
public class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserService userService;

    @Autowired
    private RequestMappingHandlerMapping handlerMapping;

    private ObjectMapper objectMapper;

    @Configuration
    static class TestConfig {
        @Bean
        @Primary
        public UserService mockUserService() {
            return mock(UserService.class);
        }
    }

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Test
    void shouldCreateUserAndReturn201Created() throws Exception {
        CreateUserDTO createUserDTO = new CreateUserDTO();
        createUserDTO.setFirstName("Jane");
        createUserDTO.setLastName("Doe");
        createUserDTO.setBirthDate(LocalDate.of(2000, 1, 1));

        UserDTO createdUserDTO = UserDTO.builder()
                .id(1)
                .firstName("Jane")
                .lastName("Doe")
                .birthDate(LocalDate.of(2000, 1, 1))
                .build();

        when(userService.createUser(any(CreateUserDTO.class))).thenReturn(createdUserDTO);

        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createUserDTO)))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.firstName").value("Jane"))
                .andExpect(jsonPath("$.lastName").value("Doe"))
                .andExpect(jsonPath("$.birthDate").value("2000-01-01"));
    }

    @Test
    void shouldReturnBadRequestWhenCreateUserWithInvalidFirstNamePattern() throws Exception {
        CreateUserDTO invalidUserDTO = new CreateUserDTO();
        invalidUserDTO.setFirstName("John123"); 
        invalidUserDTO.setLastName("Doe");
        invalidUserDTO.setBirthDate(LocalDate.of(2000, 1, 1));

        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidUserDTO)))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.firstName").exists())
                .andExpect(jsonPath("$.firstName").value("First name must contain only letters")); // Expectativa para @Pattern
    }

    @Test
    void shouldListAllUsersAndReturn200Ok() throws Exception {
        UserDTO user1 = UserDTO.builder().id(1).firstName("Alice").lastName("Smith").birthDate(LocalDate.of(1990, 1, 1)).build();
        UserDTO user2 = UserDTO.builder().id(2).firstName("Bob").lastName("Johnson").birthDate(LocalDate.of(1995, 5, 5)).build();
        List<UserDTO> users = Arrays.asList(user1, user2);

        when(userService.listAllUsers()).thenReturn(users);

        mockMvc.perform(get("/api/users")
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].firstName").value("Alice"))
                .andExpect(jsonPath("$[1].firstName").value("Bob"))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void shouldReturnEmptyListWhenNoUsersExist() throws Exception {
        when(userService.listAllUsers()).thenReturn(List.of());

        mockMvc.perform(get("/api/users")
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void shouldDiscoverAllEndpoints() {
        System.out.println("\n--- DISCOVERING SPRING MVC ENDPOINTS (UserController) ---");
        handlerMapping.getHandlerMethods().forEach((mapping, method) -> {
            System.out.println("  " + mapping.getPatternsCondition() + " " + method.getMethod().getName() + " (" + method.getBeanType().getSimpleName() + ")");
        });
        System.out.println("-----------------------------------------------------------\n");
    }
}