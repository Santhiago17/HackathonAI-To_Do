package com.hackathon_AI.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.hackathon_AI.model.TaskStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TaskDTO {
    private Integer id;
    private String title;
    private String description;
    private LocalDate endDate;
    private Integer creatorId;
    private Integer assigneeId;
    private List<String> tags;
    private String priority;
    private TaskStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
