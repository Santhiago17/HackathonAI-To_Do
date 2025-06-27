package com.hackathon_AI.dto.response;

import java.time.LocalDate;
import java.time.Period;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDTO {
    private Integer id;
    private String firstName;
    private String lastName;
    private LocalDate birthDate;
    private Integer age;

    public Integer getAge() {
        if (birthDate == null) return null;
        return Period.between(birthDate, LocalDate.now()).getYears();
    }
}
