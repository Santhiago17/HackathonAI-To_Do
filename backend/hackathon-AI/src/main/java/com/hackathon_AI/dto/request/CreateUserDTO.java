package com.hackathon_AI.dto.request;

import java.time.LocalDate;

import com.hackathon_AI.validation.constraints.MinimumAge;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateUserDTO {
    @Schema(description = "First name of the user", example = "John", type = "string")
    @NotBlank(message = "First name is required")
    @Size(max = 30, message = "First name can have at most 30 characters")
    @Pattern(regexp = "^[\\p{L} .'-]+$", message = "First name must contain only letters")
    private String firstName;

    @Schema(description = "Last name of the user", example = "Doe", type = "string")
    @NotBlank(message = "Last name is required")
    @Size(max = 100, message = "Last name can have at most 100 characters")
    @Pattern(regexp = "^[\\p{L} .'-]+$", message = "Last name must contain only letters")
    private String lastName;

    @Schema(description = "Birth date of the user", example = "1990-01-01", type = "string")
    @NotNull(message = "Birth date is required")
    @Past(message = "Birth date must be in the past")
    @MinimumAge
    private LocalDate birthDate;
}
