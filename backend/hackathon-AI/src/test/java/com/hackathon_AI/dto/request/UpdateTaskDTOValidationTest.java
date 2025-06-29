package com.hackathon_AI.dto.request;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.hackathon_AI.model.TaskStatus;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class UpdateTaskDTOValidationTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void shouldPassValidationForValidUpdateTaskDTOWithAllFields() {
        UpdateTaskDTO dto = new UpdateTaskDTO(
                "Updated Title",
                "Updated Description for the task.",
                LocalDate.now().plusDays(5),
                Arrays.asList("newTag1", "newTag2"),
                "HIGH",
                TaskStatus.COMPLETED,
                1
        );
        Set<ConstraintViolation<UpdateTaskDTO>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty(), "Expected no violations for a valid DTO with all fields.");
    }

    @Test
    void shouldPassValidationForEmptyUpdateTaskDTO() {
        UpdateTaskDTO dto = new UpdateTaskDTO();
        dto.setPriority("HIGH");
        Set<ConstraintViolation<UpdateTaskDTO>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty(), "Expected no violations for an empty DTO.");
    }

    @Test
    void shouldFailValidationWhenTitleIsTooLong() {
        UpdateTaskDTO dto = new UpdateTaskDTO();
        dto.setTitle("a".repeat(101));
        Set<ConstraintViolation<UpdateTaskDTO>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty(), "Expected violations for too long title.");
        assertEquals(2, violations.size());
        assertEquals("Title must have less than 100 characters", violations.iterator().next().getMessage());
        assertEquals("title", violations.iterator().next().getPropertyPath().toString());
    }

    @Test
    void shouldFailValidationWhenDescriptionIsTooLong() {
        UpdateTaskDTO dto = new UpdateTaskDTO();
        dto.setPriority("HIGH");
        dto.setDescription("a".repeat(1001));
        Set<ConstraintViolation<UpdateTaskDTO>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty(), "Expected violations for too long description.");
        assertEquals(1, violations.size());
        assertEquals("Description must have less than 1000 characters", violations.iterator().next().getMessage());
        assertEquals("description", violations.iterator().next().getPropertyPath().toString());
    }

    @Test
    void shouldFailValidationWhenPriorityIsInvalid() {
        UpdateTaskDTO dto = new UpdateTaskDTO();
        dto.setPriority("WRONG_PRIORITY");
        Set<ConstraintViolation<UpdateTaskDTO>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty(), "Expected violations for invalid priority.");
        assertEquals(1, violations.size());
        assertEquals("Priority must be classified in LOW, MEDIUM or HIGH", violations.iterator().next().getMessage());
        assertEquals("priority", violations.iterator().next().getPropertyPath().toString());
    }

    @Test
    void shouldFailValidationWhenTagsExceedsMaxSize() {
        UpdateTaskDTO dto = new UpdateTaskDTO();
        dto.setPriority("HIGH");
        dto.setTags(Arrays.asList("tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8"));
        Set<ConstraintViolation<UpdateTaskDTO>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty(), "Expected violations for too many tags.");
        assertEquals(1, violations.size());
        assertEquals("Maximum of 7 tags allowed", violations.iterator().next().getMessage());
        assertEquals("tags", violations.iterator().next().getPropertyPath().toString());
    }

    @Test
    void shouldFailValidationWhenATagInListIsTooLong() {
        UpdateTaskDTO dto = new UpdateTaskDTO();
        dto.setPriority("HIGH");
        dto.setTags(Arrays.asList("tag1", "a".repeat(31)));
        Set<ConstraintViolation<UpdateTaskDTO>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty(), "Expected violations for a tag that is too long.");
        assertEquals(1, violations.size());
        assertEquals("Each tag must have less than 30 characters", violations.iterator().next().getMessage());
        assertTrue(violations.iterator().next().getPropertyPath().toString().startsWith("tags["), "Property path should indicate an issue within tags list.");
    }
}