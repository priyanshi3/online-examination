package com.example.online_examination.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.online_examination.entity.Difficulty;

@Repository
public interface DifficultyRepository extends JpaRepository<Difficulty, Integer> {

}
