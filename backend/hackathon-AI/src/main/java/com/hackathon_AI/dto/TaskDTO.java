package com.hackathon_AI.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.hackathon_AI.model.TaskStatus;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TaskDTO {
    private Integer id;
    private String title;
    private String description;
    private LocalDate endDate;
    private UserDTO creator;
    private UserDTO assignee;
    private List<String> tags;
    private String priority;
    private TaskStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
