package com.example.online_examination.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Question {

	@Id
	@Column(name = "question_ID")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long questionId;

	@Column(name = "question", nullable = false)
	private String question;

	@ManyToOne
	@JoinColumn(name = "category_ID", nullable = false)
	private Category categoryId;

	@ManyToOne
	@JoinColumn(name = "difficulty_level_ID")
	private Difficulty difficultyLevelId;

	public Question() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Question(Long questionId, String question, Category categoryId, Difficulty difficultyLevelId) {
		super();
		this.questionId = questionId;
		this.question = question;
		this.categoryId = categoryId;
		this.difficultyLevelId = difficultyLevelId;
	}

	public Long getQuestionId() {
		return questionId;
	}

	public void setQuestionId(Long questionId) {
		this.questionId = questionId;
	}

	public String getQuestion() {
		return question;
	}

	public void setQuestion(String question) {
		this.question = question;
	}

	public Category getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(Category categoryId) {
		this.categoryId = categoryId;
	}

	public Difficulty getDifficultyLevelId() {
		return difficultyLevelId;
	}

	public void setDifficultyLevelId(Difficulty difficultyLevelId) {
		this.difficultyLevelId = difficultyLevelId;
	}

}
