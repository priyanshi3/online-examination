package com.example.online_examination.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.online_examination.entity.Result;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {

	// To update programming score after assessment
	public Optional<Result> findByExam_ExamIdAndStudent_StudentId(Long examId, Long studentid);

	// to check if student gave exam again
	public long countByExam_ExamIdAndStudent_StudentId(Long examId, Long studentid);

	public List<Result> findAllByExam_ExamId(Long examId);
}
