package com.hackathon_AI.model;

import java.time.LocalDate;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @NotBlank(message = "First name is required")
    @Size(max = 30, message = "First name must not exceed 30 characters")
    @Column(name = "first_name", nullable = false)
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Size(max = 100, message = "Last name must not exceed 100 characters")
    @Column(name = "last_name", nullable = false)
    private String lastName;
    
    @NotNull(message = "Birth date is required")
    @Past(message = "Birth date must be in the past")
    @Column(name = "birth_date", nullable = false)
    private LocalDate birthDate;
    @Transient
    private Integer age;

    public Integer getAge() {
        if (birthDate == null) return null;
        return LocalDate.now().getYear() - birthDate.getYear();
    }
}
