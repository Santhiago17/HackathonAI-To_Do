package com.hackathon_AI.dto.request;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class CreateUserDTOValidationTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void shouldPassValidationForValidUserDTO() {
        CreateUserDTO dto = new CreateUserDTO(
                "John",
                "Doe",
                LocalDate.of(2000, 1, 1)
        );

        Set<ConstraintViolation<CreateUserDTO>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty(), "Expected no violations for a valid DTO");
    }

    @Test
    void shouldFailValidationWhenFirstNameIsBlank() {
        CreateUserDTO dto = new CreateUserDTO(
                "",
                "Doe",
                LocalDate.of(2000, 1, 1)
        );

        Set<ConstraintViolation<CreateUserDTO>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty(), "Expected violations for blank first name");
        assertEquals(2, violations.size());
        assertEquals("First name must contain only letters", violations.iterator().next().getMessage());
        assertEquals("firstName", violations.iterator().next().getPropertyPath().toString());
    }

    @Test
    void shouldFailValidationWhenFirstNameIsTooLong() {
        CreateUserDTO dto = new CreateUserDTO(
                "a".repeat(31),
                "Doe",
                LocalDate.of(2000, 1, 1)
        );

        Set<ConstraintViolation<CreateUserDTO>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty(), "Expected violations for too long first name");
        assertEquals(1, violations.size());
        assertEquals("First name can have at most 30 characters", violations.iterator().next().getMessage());
        assertEquals("firstName", violations.iterator().next().getPropertyPath().toString());
    }

    @Test
    void shouldFailValidationWhenFirstNameContainsInvalidCharacters() {
        CreateUserDTO dto = new CreateUserDTO(
                "John123",
                "Doe",
                LocalDate.of(2000, 1, 1)
        );

        Set<ConstraintViolation<CreateUserDTO>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty(), "Expected violations for invalid characters in first name");
        assertEquals(1, violations.size());
        assertEquals("First name must contain only letters", violations.iterator().next().getMessage());
        assertEquals("firstName", violations.iterator().next().getPropertyPath().toString());
    }

    @Test
    void shouldFailValidationWhenLastNameIsBlank() {
        CreateUserDTO dto = new CreateUserDTO(
                "John",
                "",
                LocalDate.of(2000, 1, 1)
        );

        Set<ConstraintViolation<CreateUserDTO>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty(), "Expected violations for blank last name");
        assertEquals(2, violations.size());
        assertEquals("Last name must contain only letters", violations.iterator().next().getMessage());
        assertEquals("lastName", violations.iterator().next().getPropertyPath().toString());
    }

    @Test
    void shouldFailValidationWhenLastNameIsTooLong() {
        CreateUserDTO dto = new CreateUserDTO(
                "John",
                "a".repeat(101),
                LocalDate.of(2000, 1, 1)
        );

        Set<ConstraintViolation<CreateUserDTO>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty(), "Expected violations for too long last name");
        assertEquals(1, violations.size());
        assertEquals("Last name can have at most 100 characters", violations.iterator().next().getMessage());
        assertEquals("lastName", violations.iterator().next().getPropertyPath().toString());
    }

    @Test
    void shouldFailValidationWhenLastNameContainsInvalidCharacters() {
        CreateUserDTO dto = new CreateUserDTO(
                "John",
                "Doe!",
                LocalDate.of(2000, 1, 1)
        );

        Set<ConstraintViolation<CreateUserDTO>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty(), "Expected violations for invalid characters in last name");
        assertEquals(1, violations.size());
        assertEquals("Last name must contain only letters", violations.iterator().next().getMessage());
        assertEquals("lastName", violations.iterator().next().getPropertyPath().toString());
    }

    @Test
    void shouldFailValidationWhenBirthDateIsInTheFuture() {
        CreateUserDTO dto = new CreateUserDTO(
                "John",
                "Doe",
                LocalDate.now().plusDays(1)
        );

        Set<ConstraintViolation<CreateUserDTO>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty(), "Expected violations for birth date in the future");
        assertEquals(2, violations.size());
        assertEquals("birthDate", violations.iterator().next().getPropertyPath().toString());
    }

    @Test
    void shouldFailValidationWhenUserIsUnder18() {
        LocalDate eighteenYearsAgo = LocalDate.now().minusYears(18);
        LocalDate underEighteenDate = eighteenYearsAgo.plusDays(1);

        CreateUserDTO dto = new CreateUserDTO(
                "John",
                "Doe",
                underEighteenDate
        );

        Set<ConstraintViolation<CreateUserDTO>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty(), "Expected violations for user under 18 years old");
        assertEquals(1, violations.size());
        assertEquals("User must be at least 18 years old", violations.iterator().next().getMessage());
        assertEquals("birthDate", violations.iterator().next().getPropertyPath().toString());
    }
}