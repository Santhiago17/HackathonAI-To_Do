package com.hackathon_AI.services;

import com.hackathon_AI.dto.CreateUserDTO;
import com.hackathon_AI.dto.UserDTO;
import com.hackathon_AI.model.User;
import com.hackathon_AI.repositories.UserRepository;
import com.hackathon_AI.utils.Converter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final Converter converter;

    public UserDTO createUser(CreateUserDTO user) {
        User newUser = userRepository.save(converter.convertObject(user, User.class));
        return converter.convertObject(newUser, UserDTO.class);
    }
    
    public List<UserDTO> listAllUsers() {
        return converter.convertList(userRepository.findAll(), UserDTO.class);
    }
}