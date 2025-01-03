package com.example.online_examination.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Options {

	@Id
	@Column(name = "option_ID")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long optionId;

	@Column(name = "option_text", nullable = false)
	private String optionText;

	@ManyToOne
	@JoinColumn(name = "question_ID", nullable = false)
	private Question questionId;

	public Options() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Options(Long optionId, String optionText, Question questionId) {
		super();
		this.optionId = optionId;
		this.optionText = optionText;
		this.questionId = questionId;
	}

	public Long getOptionId() {
		return optionId;
	}

	public void setOptionId(Long optionId) {
		this.optionId = optionId;
	}

	public String getOptionText() {
		return optionText;
	}

	public void setOptionText(String optionText) {
		this.optionText = optionText;
	}

	public Question getQuestionId() {
		return questionId;
	}

	public void setQuestionId(Question questionId) {
		this.questionId = questionId;
	}

}
