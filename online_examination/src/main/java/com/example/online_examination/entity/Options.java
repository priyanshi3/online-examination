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

}
