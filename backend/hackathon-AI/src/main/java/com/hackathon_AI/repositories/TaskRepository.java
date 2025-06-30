package com.hackathon_AI.repositories;

import com.hackathon_AI.model.Task;
import com.hackathon_AI.model.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
    List<Task> findByAssigneeId(Integer assigneeId);
    
    List<Task> findByAssignee(User assignee);
    
    @Query("SELECT t FROM Task t JOIN t.tags tag WHERE LOWER(tag) LIKE LOWER(CONCAT('%', :tag, '%'))")
    List<Task> findTasksByTagsContaining(@Param("tag") String tagPattern);
    
    @Query("SELECT t FROM Task t JOIN t.tags tag WHERE tag = :exactTag")
    List<Task> findTasksByExactTag(@Param("exactTag") String exactTag);
}
