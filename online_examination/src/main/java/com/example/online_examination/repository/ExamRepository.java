package com.example.online_examination.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.online_examination.entity.Exam;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {

	// to get active exam for student exam
	Optional<Exam> findByActive(Boolean active);
}
