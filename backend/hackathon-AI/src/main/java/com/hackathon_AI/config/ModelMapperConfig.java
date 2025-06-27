package com.hackathon_AI.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig<D, E> {

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

}