package com.example.online_examination.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.online_examination.entity.ExamQuestion;

@Repository
public interface ExamQuestionRepository extends JpaRepository<ExamQuestion, Long> {

	// fetch questionID for exam from active exam
	@Query("SELECT q FROM ExamQuestion q where q.exam.examId = :examId")
	public List<ExamQuestion> fetchForExam(Integer examId);
}
