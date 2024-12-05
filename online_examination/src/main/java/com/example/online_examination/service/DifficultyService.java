package com.example.online_examination.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.online_examination.entity.Difficulty;
import com.example.online_examination.repository.DifficultyRepository;

@Service
public class DifficultyService {

	@Autowired
	private DifficultyRepository difficultyRepository;

	public List<Difficulty> fetchAllDifficulty() {
		return difficultyRepository.findAll();
	}
}
