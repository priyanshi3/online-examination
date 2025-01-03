package com.example.online_examination.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.online_examination.entity.Options;
import com.example.online_examination.entity.Question;

@Repository
public interface OptionsRepository extends JpaRepository<Options, Long> {

	// find option Id by option Text to set option Id to answer
	Optional<Options> findByOptionTextAndQuestionId(String optionText, Question questionId);

	// fetch options from question ID for exam
	@Query("SELECT o FROM Options o WHERE o.questionId.questionId = :questionId")
	List<Options> fetchOptionsForExam(Integer questionId);
}
