package com.example.online_examination.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Answer {

	@Id
	@Column(name = "answer_ID")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long answerId;

	@ManyToOne
	@JoinColumn(name = "question_ID", nullable = false)
	private Question questionId;

	@ManyToOne
	@JoinColumn(name = "option_ID", nullable = false)
	private Options optionId;

	public Answer() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Answer(Long answerId, Question questionId, Options optionId) {
		super();
		this.answerId = answerId;
		this.questionId = questionId;
		this.optionId = optionId;
	}

	public Long getAnswerId() {
		return answerId;
	}

	public void setAnswerId(Long answerId) {
		this.answerId = answerId;
	}

	public Question getQuestionId() {
		return questionId;
	}

	public void setQuestionId(Question questionId) {
		this.questionId = questionId;
	}

	public Options getOptionId() {
		return optionId;
	}

	public void setOptionId(Options optionId) {
		this.optionId = optionId;
	}
}
