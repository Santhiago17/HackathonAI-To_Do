package com.hackathon_AI.dto;

import java.time.LocalDate;
import java.util.List;

import com.hackathon_AI.model.TaskStatus;

import com.hackathon_AI.validation.constraints.ValidPriority;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateTaskDTO {
    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title must have less than 100 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 1000, message = "Description must have less than 1000 characters")
    private String description;

    @NotNull(message = "End date is required")
    @FutureOrPresent(message = "End date cannot be in the past")
    private LocalDate endDate;

    @NotNull(message = "Creator user ID is required")
    private Integer creatorId;

    @NotNull(message = "Assignee user ID is required")
    private Integer assigneeId;

    @Size(max = 7, message = "Maximum of 7 tags allowed")
    private List<@Size(max = 30, message = "Each tag must have less than 30 characters") String> tags;

    @NotBlank(message = "Priority is required")
    @ValidPriority
    private String priority;

    @NotNull(message = "Status is required")
    private TaskStatus status;
}