package com.hackathon_AI.dto.request;

import com.hackathon_AI.validation.constraints.ValidPriority;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTaskDTO {
    @Size(max = 100, message = "Title must have less than 100 characters")
    private String title;
    @Size(max = 1000, message = "Description must have less than 1000 characters")
    private String description;
    @FutureOrPresent(message = "End date cannot be in the past")
    private LocalDate endDate;
    @Size(max = 7, message = "Maximum of 7 tags allowed")
    private List<@Size(max = 30, message = "Each tag must have less than 30 characters") String> tags;
    @ValidPriority
    private String priority;
}
