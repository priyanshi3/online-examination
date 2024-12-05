package com.example.online_examination.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.online_examination.entity.Difficulty;
import com.example.online_examination.service.DifficultyService;

@RestController
@RequestMapping("/difficulty")
public class DifficultyController {

	@Autowired
	private DifficultyService difficultyService;

	@GetMapping("fetchAll")
	public List<Difficulty> fetchAllDifficulty() {
		return difficultyService.fetchAllDifficulty();
	}

}
