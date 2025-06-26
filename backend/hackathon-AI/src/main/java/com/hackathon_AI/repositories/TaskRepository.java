package com.hackathon_AI.repositories;

import com.hackathon_AI.entities.Task;
import com.hackathon_AI.entities.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
    // 1. Buscar tarefas por ID do responsável
    List<Task> findByAssigneeId(Integer assigneeId);
    
    // Método alternativo usando o objeto User completo
    List<Task> findByAssignee(User assignee);
    
    // 2. Buscar tarefas que contenham uma tag (busca parcial)
    @Query("SELECT t FROM Task t JOIN t.tags tag WHERE tag LIKE %:tagPattern%")
    List<Task> findTasksByTagsContaining(@Param("tagPattern") String tagPattern);
    
    // 3. Busca por tag exata
    @Query("SELECT t FROM Task t JOIN t.tags tag WHERE tag = :exactTag")
    List<Task> findTasksByExactTag(@Param("exactTag") String exactTag);
}
