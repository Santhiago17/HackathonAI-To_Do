package com.hackathon_AI.validation.constraints;

import com.hackathon_AI.validation.MinimumAgeValidator;
import com.hackathon_AI.validation.PriorityValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = PriorityValidator.class)
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPriority {
    String message() default "Priority must be classified in LOW, MEDIUM or HIGH";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

