package com.example.online_examination.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.online_examination.entity.ProgramCheck;

@Repository
public interface ProgramCheckRepository extends JpaRepository<ProgramCheck, Long> {

	List<ProgramCheck> findByMarksIsNullOrderByQuestionAsc();
}
