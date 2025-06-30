package com.hackathon_AI.dto.request;

import com.hackathon_AI.validation.constraints.ValidPriority;
import com.hackathon_AI.model.TaskStatus;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTaskDTO {
    @Schema(description = "Title of the task", example = "Preparar a janta", type = "string")
    @Size(max = 100, message = "Title must have less than 100 characters")
    private String title;

    @Schema(description = "Description of the task", example = "Massa Alho e Óleo", type = "string")
    @Size(max = 1000, message = "Description must have less than 1000 characters")
    private String description;

    @Schema(description = "End date of the task", example = "2025-08-10", type = "LocalDate")
    private LocalDate endDate;

    @Schema(description = "Tags of the task", example = "[\"Meal\"]", type = "string")
    @Size(max = 7, message = "Maximum of 7 tags allowed")
    private List<@Size(max = 30, message = "Each tag must have less than 30 characters") String> tags;

    @Schema(description = "Priority of the task", example = "HIGH", type = "string")
    @ValidPriority
    private String priority;

    @Schema(description = "Status of the task", example = "IN_PROGRESS", type = "string")
    private TaskStatus status;

    @Schema(description = "ID of the user assigned for the task", example = "1", type = "integer")
    private Integer assigneeId;
}
