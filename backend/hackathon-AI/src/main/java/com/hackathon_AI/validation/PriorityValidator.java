package com.hackathon_AI.validation;

import com.hackathon_AI.validation.constraints.ValidPriority;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.List;

public class PriorityValidator implements ConstraintValidator<ValidPriority, String> {
    @Override
    public boolean isValid(String priority, ConstraintValidatorContext constraintValidatorContext) {
        return priority != null && List.of("LOW", "MEDIUM", "HIGH").contains(priority.toUpperCase());
    }
}