package com.hackathon_AI.services;

import com.hackathon_AI.model.User;
import com.hackathon_AI.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

@Service
public class UserService {
    
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public User createUser(User user) {
        validateUserData(user.getFirstName(), user.getLastName(), user.getBirthDate());
        
        int age = Period.between(user.getBirthDate(), LocalDate.now()).getYears();
        user.setAge(age);
        
        return userRepository.save(user);
    }
    
    public List<User> listAllUsers() {
        return userRepository.findAll();
    }
    
    private void validateUserData(String firstName, String lastName, LocalDate birthDate) {
        if (firstName == null || firstName.trim().isEmpty()) {
            throw new IllegalArgumentException("First name is required");
        }
        
        if (firstName.length() > 30) {
            throw new IllegalArgumentException("First name must not exceed 30 characters");
        }
        
        if (lastName == null || lastName.trim().isEmpty()) {
            throw new IllegalArgumentException("Last name is required");
        }
        if (lastName.length() > 100) {
            throw new IllegalArgumentException("Last name must not exceed 100 characters");
        }
        
        if (birthDate == null) {
            throw new IllegalArgumentException("Birth date is required");
        }
        
        int age = Period.between(birthDate, LocalDate.now()).getYears();
        if (age < 18) {
            throw new IllegalArgumentException("User must be at least 18 years old");
        }
    }
}