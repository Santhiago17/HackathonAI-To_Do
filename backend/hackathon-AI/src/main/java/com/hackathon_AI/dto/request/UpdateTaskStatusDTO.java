package com.hackathon_AI.dto.request;

import com.hackathon_AI.model.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTaskStatusDTO {
    private TaskStatus status;
}
