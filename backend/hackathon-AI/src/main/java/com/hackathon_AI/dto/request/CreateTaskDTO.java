package com.hackathon_AI.dto.request;

import java.time.LocalDate;
import java.util.List;

import com.hackathon_AI.model.TaskStatus;

import com.hackathon_AI.validation.constraints.ValidPriority;

import io.swagger.v3.oas.annotations.media.Schema;
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
    @Schema(description = "Title of the task", example = "Passear com o cachorro", type = "string")
    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title must have less than 100 characters")
    private String title;

    @Schema(description = "Description of the task", example = "Levar o dog para dar uma volta", type = "string")
    @NotBlank(message = "Description is required")
    @Size(max = 1000, message = "Description must have less than 1000 characters")
    private String description;

    @Schema(description = "End date of the task", example = "2025-06-29", type = "LocalDate")
    @NotNull(message = "End date is required")
    @FutureOrPresent(message = "End date cannot be in the past")
    private LocalDate endDate;

    @Schema(description = "ID of the creator of the task", example = "1", type = "integer")
    @NotNull(message = "Creator user ID is required")
    private Integer creatorId;

    @Schema(description = "ID of the user assigned for the task", example = "1", type = "integer")
    @NotNull(message = "Assignee user ID is required")
    private Integer assigneeId;

    @Schema(description = "Tags for the task", example = "[\"work\"]", type = "string")
    @Size(max = 7, message = "Maximum of 7 tags allowed")
    private List<@Size(max = 30, message = "Each tag must have less than 30 characters") String> tags;

    @Schema(description = "Priority of the task", example = "LOW", type = "string")
    @NotBlank(message = "Priority is required")
    @ValidPriority
    private String priority;

    @Schema(description = "Status of the task", example = "PENDING", type = "string")
    @NotNull(message = "Status is required")
    private TaskStatus status;
}