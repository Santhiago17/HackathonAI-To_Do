package com.hackathon_AI.dto.request;

import com.hackathon_AI.model.TaskStatus;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class CreateTaskDTOValidationTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void shouldPassValidationForValidCreateTaskDTO() {
        CreateTaskDTO dto = new CreateTaskDTO(
                "Valid Title",
                "Valid Description for the task.",
                LocalDate.now().plusDays(1),
                1,
                2,
                Arrays.asList("tag1", "tag2"),
                "LOW",
                TaskStatus.PENDING
        );

        Set<ConstraintViolation<CreateTaskDTO>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty(), "Expected no violations for a valid DTO.");
    }

    @Test
    void shouldFailValidationWhenTitleIsBlank() {
        CreateTaskDTO dto = new CreateTaskDTO(
                "",
                "Valid Description",
                LocalDate.now().plusDays(1),
                1, 2, Collections.emptyList(), "LOW", TaskStatus.PENDING
        );
        Set<ConstraintViolation<CreateTaskDTO>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty(), "Expected violations for blank title.");
        assertEquals(1, violations.size());
        assertEquals("Title is required", violations.iterator().next().getMessage());
        assertEquals("title", violations.iterator().next().getPropertyPath().toString());
    }

    @Test
    void shouldFailValidationWhenTitleIsTooLong() {
        CreateTaskDTO dto = new CreateTaskDTO(
                "a".repeat(101),
                "Valid Description",
                LocalDate.now().plusDays(1),
                1, 2, Collections.emptyList(), "LOW", TaskStatus.PENDING
        );
        Set<ConstraintViolation<CreateTaskDTO>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty(), "Expected violations for too long title.");
        assertEquals(1, violations.size());
        assertEquals("Title must have less than 100 characters", violations.iterator().next().getMessage());
        assertEquals("title", violations.iterator().next().getPropertyPath().toString());
    }

    @Test
    void shouldFailValidationWhenDescriptionIsBlank() {
        CreateTaskDTO dto = new CreateTaskDTO(
                "Valid Title",
                "",
                LocalDate.now().plusDays(1),
                1, 2, Collections.emptyList(), "LOW", TaskStatus.PENDING
        );
        Set<ConstraintViolation<CreateTaskDTO>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty(), "Expected violations for blank description.");
        assertEquals(1, violations.size());
        assertEquals("Description is required", violations.iterator().next().getMessage());
        assertEquals("description", violations.iterator().next().getPropertyPath().toString());
    }

    @Test
    void shouldFailValidationWhenDescriptionIsTooLong() {
        CreateTaskDTO dto = new CreateTaskDTO(
                "Valid Title",
                "a".repeat(1001),
                LocalDate.now().plusDays(1),
                1, 2, Collections.emptyList(), "LOW", TaskStatus.PENDING
        );
        Set<ConstraintViolation<CreateTaskDTO>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty(), "Expected violations for too long description.");
        assertEquals(1, violations.size());
        assertEquals("Description must have less than 1000 characters", violations.iterator().next().getMessage());
        assertEquals("description", violations.iterator().next().getPropertyPath().toString());
    }

    @Test
    void shouldFailValidationWhenEndDateIsNull() {
        CreateTaskDTO dto = new CreateTaskDTO(
                "Valid Title",
                "Valid Description",
                null,
                1, 2, Collections.emptyList(), "LOW", TaskStatus.PENDING
        );
        Set<ConstraintViolation<CreateTaskDTO>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty(), "Expected violations for null end date.");
        assertEquals(1, violations.size());
        assertEquals("End date is required", violations.iterator().next().getMessage());
        assertEquals("endDate", violations.iterator().next().getPropertyPath().toString());
    }

    @Test
    void shouldFailValidationWhenEndDateIsInThePast() {
        CreateTaskDTO dto = new CreateTaskDTO(
                "Valid Title",
                "Valid Description",
                LocalDate.now().minusDays(1),
                1, 2, Collections.emptyList(), "LOW", TaskStatus.PENDING
        );
        Set<ConstraintViolation<CreateTaskDTO>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty(), "Expected violations for end date in the past.");
        assertEquals(1, violations.size());
        assertEquals("End date cannot be in the past", violations.iterator().next().getMessage());
        assertEquals("endDate", violations.iterator().next().getPropertyPath().toString());
    }

    @Test
    void shouldFailValidationWhenCreatorIdIsNull() {
        CreateTaskDTO dto = new CreateTaskDTO(
                "Valid Title",
                "Valid Description",
                LocalDate.now().plusDays(1),
                null,
                2, Collections.emptyList(), "LOW", TaskStatus.PENDING
        );
        Set<ConstraintViolation<CreateTaskDTO>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty(), "Expected violations for null creatorId.");
        assertEquals(1, violations.size());
        assertEquals("Creator user ID is required", violations.iterator().next().getMessage());
        assertEquals("creatorId", violations.iterator().next().getPropertyPath().toString());
    }

    @Test
    void shouldFailValidationWhenAssigneeIdIsNull() {
        CreateTaskDTO dto = new CreateTaskDTO(
                "Valid Title",
                "Valid Description",
                LocalDate.now().plusDays(1),
                1,
                null,
                Collections.emptyList(), "LOW", TaskStatus.PENDING
        );
        Set<ConstraintViolation<CreateTaskDTO>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty(), "Expected violations for null assigneeId.");
        assertEquals(1, violations.size());
        assertEquals("Assignee user ID is required", violations.iterator().next().getMessage());
        assertEquals("assigneeId", violations.iterator().next().getPropertyPath().toString());
    }

    @Test
    void shouldFailValidationWhenPriorityIsBlank() {
        CreateTaskDTO dto = new CreateTaskDTO(
                "Valid Title",
                "Valid Description",
                LocalDate.now().plusDays(1),
                1, 2, Collections.emptyList(),
                "",
                TaskStatus.PENDING
        );
        Set<ConstraintViolation<CreateTaskDTO>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty(), "Expected violations for blank priority.");
        assertEquals(2, violations.size());
        assertEquals("Priority must be classified in LOW, MEDIUM or HIGH", violations.iterator().next().getMessage());
        assertEquals("priority", violations.iterator().next().getPropertyPath().toString());
    }

    @Test
    void shouldFailValidationWhenPriorityIsInvalid() {
        CreateTaskDTO dto = new CreateTaskDTO(
                "Valid Title",
                "Valid Description",
                LocalDate.now().plusDays(1),
                1, 2, Collections.emptyList(),
                "INVALID_PRIORITY",
                TaskStatus.PENDING
        );
        Set<ConstraintViolation<CreateTaskDTO>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty(), "Expected violations for invalid priority.");
        assertEquals(1, violations.size());
        assertEquals("Priority must be classified in LOW, MEDIUM or HIGH", violations.iterator().next().getMessage());
        assertEquals("priority", violations.iterator().next().getPropertyPath().toString());
    }

    @Test
    void shouldFailValidationWhenStatusIsNull() {
        CreateTaskDTO dto = new CreateTaskDTO(
                "Valid Title",
                "Valid Description",
                LocalDate.now().plusDays(1),
                1, 2, Collections.emptyList(), "LOW",
                null
        );
        Set<ConstraintViolation<CreateTaskDTO>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty(), "Expected violations for null status.");
        assertEquals(1, violations.size());
        assertEquals("Status is required", violations.iterator().next().getMessage());
        assertEquals("status", violations.iterator().next().getPropertyPath().toString());
    }

    @Test
    void shouldFailValidationWhenTagsExceedsMaxSize() {
        CreateTaskDTO dto = new CreateTaskDTO(
                "Valid Title",
                "Valid Description",
                LocalDate.now().plusDays(1),
                1, 2,
                Arrays.asList("tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8"),
                "LOW",
                TaskStatus.PENDING
        );
        Set<ConstraintViolation<CreateTaskDTO>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty(), "Expected violations for too many tags.");
        assertEquals(1, violations.size());
        assertEquals("Maximum of 7 tags allowed", violations.iterator().next().getMessage());
        assertEquals("tags", violations.iterator().next().getPropertyPath().toString());
    }

    @Test
    void shouldFailValidationWhenATagIsTooLong() {
        CreateTaskDTO dto = new CreateTaskDTO(
                "Valid Title",
                "Valid Description",
                LocalDate.now().plusDays(1),
                1, 2,
                Arrays.asList("tag1", "tag2", "a".repeat(31)),
                "LOW",
                TaskStatus.PENDING
        );
        Set<ConstraintViolation<CreateTaskDTO>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty(), "Expected violations for a tag that is too long.");
        assertEquals(1, violations.size());
        assertEquals("Each tag must have less than 30 characters", violations.iterator().next().getMessage());
        assertTrue(violations.iterator().next().getPropertyPath().toString().startsWith("tags["), "Property path should indicate an issue within tags list.");
    }
}