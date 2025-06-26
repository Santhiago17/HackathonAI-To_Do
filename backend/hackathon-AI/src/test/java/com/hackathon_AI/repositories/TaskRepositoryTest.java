package com.hackathon_AI.repositories;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import com.hackathon_AI.model.Task;
import com.hackathon_AI.model.User;
import com.hackathon_AI.model.TaskStatus;

@DataJpaTest
public class TaskRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private UserRepository userRepository;

    @Test
    public void shouldSaveTask() {
        User user = new User();
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setBirthDate(LocalDate.of(1990, 1, 1));
        User savedUser = userRepository.save(user);

        
        Task task = new Task();
        task.setCreator(savedUser);
        task.setTitle("Test Task");
        task.setDescription("Test Description");
        task.setEndDate(LocalDate.now());
        task.setStatus(TaskStatus.COMPLETED);

        Task savedTask = taskRepository.save(task);
        Task foundTask = entityManager.find(Task.class, savedTask.getId());

        assertThat(foundTask).isNotNull();
        assertThat(foundTask.getTitle()).isEqualTo(task.getTitle());
        assertThat(foundTask.getDescription()).isEqualTo(task.getDescription());
        assertThat(foundTask.getEndDate()).isEqualTo(task.getEndDate());
        assertThat(foundTask.getStatus()).isEqualTo(task.getStatus());
    }

    @Test
    public void shouldFindTaskById() {
        User user = new User();
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setBirthDate(LocalDate.of(1990, 1, 1));
        User savedUser = userRepository.save(user);

        Task task = new Task();
        task.setCreator(savedUser);
        task.setTitle("Test Task");
        task.setDescription("Test Description");
        task.setEndDate(LocalDate.now());
        task.setStatus(TaskStatus.COMPLETED);
        
        entityManager.persist(task);
        entityManager.flush();

        Optional<Task> found = taskRepository.findById(task.getId());

        assertThat(found).isPresent();
        assertThat(found.get().getTitle()).isEqualTo(task.getTitle());
    }

    @Test
    public void shouldFindAllTasks() {
        User user = new User();
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setBirthDate(LocalDate.of(1990, 1, 1));
        User savedUser = userRepository.save(user);

        Task task1 = new Task();
        task1.setCreator(savedUser);
        task1.setTitle("Task 1");
        task1.setDescription("Description 1");
        task1.setEndDate(LocalDate.now());
        task1.setStatus(TaskStatus.IN_PROGRESS);

        User user2 = new User();
        user2.setFirstName("John");
        user2.setLastName("Doe");
        user2.setBirthDate(LocalDate.of(1990, 1, 1));
        User savedUser2 = userRepository.save(user2);

        Task task2 = new Task();
        task2.setCreator(savedUser2);
        task2.setTitle("Task 2");
        task2.setDescription("Description 2"); 
        task2.setEndDate(LocalDate.now());
        task2.setStatus(TaskStatus.COMPLETED);

        entityManager.persist(task1);
        entityManager.persist(task2);
        entityManager.flush();

        List<Task> tasks = taskRepository.findAll();

        assertThat(tasks).hasSize(2);
        assertThat(tasks).contains(task1, task2);
    }

    @Test
    public void shouldDeleteTask() {
        User user = new User();
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setBirthDate(LocalDate.of(1990, 1, 1));
        User savedUser = userRepository.save(user);

        Task task = new Task();
        task.setCreator(savedUser);
        task.setTitle("Test Task");
        task.setDescription("Test Description");
        task.setEndDate(LocalDate.now());
        task.setStatus(TaskStatus.IN_PROGRESS);

        entityManager.persist(task);
        entityManager.flush();

        taskRepository.deleteById(task.getId());

        Task found = entityManager.find(Task.class, task.getId());
        assertThat(found).isNull();
    }        
}
