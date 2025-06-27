package com.hackathon_AI.utils;

import com.hackathon_AI.dto.TaskDTO;
import com.hackathon_AI.dto.UserDTO;
import com.hackathon_AI.model.Task;
import com.hackathon_AI.model.User;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class Converter {
    private final ModelMapper modelMapper;

    public <S, T> T convertObject(S source, Class<T> targetClass) {
        return modelMapper.map(source, targetClass);
    }

    public <S, T> List<T> convertList(List<S> sourceList, Class<T> targetClass) {
        return sourceList
                .stream()
                .map(element -> modelMapper.map(element, targetClass))
                .collect(Collectors.toList());
    }

    public TaskDTO toTaskResponseDTO(Task task) {
        return TaskDTO.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .endDate(task.getEndDate())
                .creator(toUserDTO(task.getCreator()))
                .assignee(toUserDTO(task.getAssignee()))
                .tags(task.getTags())
                .priority(task.getPriority())
                .status(task.getStatus())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }

    private UserDTO toUserDTO(User user) {
        if (user == null) return null;

        return UserDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .birthDate(user.getBirthDate())
                .build();
    }

    public List<TaskDTO> toTaskResponseDTOList(List<Task> tasks) {
        return tasks.stream()
                .map(this::toTaskResponseDTO)
                .toList();
    }
}
