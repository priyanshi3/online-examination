package com.example.online_examination.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Difficulty {

	@Id
	@Column(name = "difficulty_level_ID")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Short difficultyLevelId; // primary key

	@Column(name = "difficulty_level", nullable = false)
	private String difficultyLevel;

	public Difficulty() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Difficulty(Short difficultyLevelId, String difficultyLevel) {
		super();
		this.difficultyLevelId = difficultyLevelId;
		this.difficultyLevel = difficultyLevel;
	}

	public Short getDifficultyLevelId() {
		return difficultyLevelId;
	}

	public void setDifficultyLevelId(Short difficultyLevelId) {
		this.difficultyLevelId = difficultyLevelId;
	}

	public String getDifficultyLevel() {
		return difficultyLevel;
	}

	public void setDifficultyLevel(String difficultyLevel) {
		this.difficultyLevel = difficultyLevel;
	}

}