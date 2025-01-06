package com.example.online_examination.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.online_examination.entity.Program;

@Repository
public interface ProgramRepository extends JpaRepository<Program, Long> {

	Optional<Program> findByQuestionId_QuestionId(Long questionId);
}
