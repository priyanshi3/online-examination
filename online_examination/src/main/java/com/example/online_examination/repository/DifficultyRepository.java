package com.example.online_examination.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.online_examination.entity.Difficulty;

@Repository
public interface DifficultyRepository extends JpaRepository<Difficulty, Integer> {

	// For Import questions which will receive difficulty level
	Optional<Difficulty> findByDifficultyLevel(String diffLevel);
}
