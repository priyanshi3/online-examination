package com.example.online_examination.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.online_examination.entity.Question;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

	// Find questions by categoryId only
	@Query("SELECT q FROM Question q WHERE q.categoryId.categoryId = :categoryId ")
	List<Question> findByCategory(Integer categoryId);

	// Find questions by categoryId and difficultyId
	@Query("SELECT q FROM Question q WHERE q.categoryId.categoryId = :categoryId "
			+ "AND (:difficultyLevelId IS NULL OR q.difficultyLevelId.difficultyLevelId = :difficultyLevelId)")
	List<Question> findByCategoryAndDifficulty(Integer categoryId, Integer difficultyLevelId);
}
