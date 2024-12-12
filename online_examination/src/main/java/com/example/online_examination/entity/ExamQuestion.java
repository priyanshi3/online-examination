package com.example.online_examination.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class ExamQuestion {

	@Id
	@Column(name = "exam_question_ID")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long examQuestionId;

	@ManyToOne
	@JoinColumn(name = "exam_ID", nullable = false)
	private Exam exam;

	@ManyToOne
	@JoinColumn(name = "question_ID", nullable = false)
	private Question question;

	public ExamQuestion() {
		super();
		// TODO Auto-generated constructor stub
	}

	public ExamQuestion(Long examQuestionId, Exam exam, Question question) {
		super();
		this.examQuestionId = examQuestionId;
		this.exam = exam;
		this.question = question;
	}

	public Long getExamQuestionId() {
		return examQuestionId;
	}

	public void setExamQuestionId(Long examQuestionId) {
		this.examQuestionId = examQuestionId;
	}

	public Exam getExam() {
		return exam;
	}

	public void setExam(Exam exam) {
		this.exam = exam;
	}

	public Question getQuestion() {
		return question;
	}

	public void setQuestion(Question question) {
		this.question = question;
	}

}
