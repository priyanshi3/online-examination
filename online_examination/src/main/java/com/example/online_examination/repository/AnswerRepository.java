package com.example.online_examination.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.online_examination.entity.Answer;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {

	// To check if answer is correct and count them for Logical category
	// DISTINCT to count only one even if there are more entries with different
	// answerId but others same
	@Query("SELECT COUNT(DISTINCT a.questionId.questionId, a.optionId.optionId) FROM Answer a "
			+ "WHERE a.questionId.questionId = :questionId AND a.optionId.optionId = :optionId ")
	public Optional<Integer> checkLogicalAndTechnical(Long questionId, Long optionId);
}
