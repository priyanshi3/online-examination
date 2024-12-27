package com.example.online_examination.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;

@Entity
public class Result {

	@Id
	@Column(name = "result_ID")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long resultId;

	@ManyToOne
	@JoinColumn(name = "student_ID", nullable = false)
	private Student student;

	@ManyToOne
	@JoinColumn(name = "exam_ID", nullable = false)
	private Exam exam;

	@Column(name = "logical_score", nullable = false)
	private Short logicalScore;

	@Column(name = "technical_score", nullable = false)
	private Short technicalScore;

	@Column(name = "program_score")
	private Short programScore;

	@Column(name = "total_score")
	private Integer totalScore;

	@PrePersist
	public void prePersist() {
		if (logicalScore == null) {
			logicalScore = 0;
		}
		if (technicalScore == null) {
			technicalScore = 0;
		}
		if (programScore == null) {
			programScore = 0;
		}
		if (totalScore == null) {
			totalScore = 0;
		}
	}

	public Result() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Result(Long resultId, Student student, Exam exam, Short logicalScore, Short technicalScore,
			Short programScore, Integer totalScore) {
		super();
		this.resultId = resultId;
		this.student = student;
		this.exam = exam;
		this.logicalScore = logicalScore != null ? logicalScore : 0;
		this.technicalScore = technicalScore != null ? technicalScore : 0;
		this.programScore = programScore;
		this.totalScore = totalScore != null ? totalScore : 0;
	}

	public Long getResultId() {
		return resultId;
	}

	public void setResultId(Long resultId) {
		this.resultId = resultId;
	}

	public Student getStudent() {
		return student;
	}

	public void setStudent(Student student) {
		this.student = student;
	}

	public Exam getExam() {
		return exam;
	}

	public void setExam(Exam exam) {
		this.exam = exam;
	}

	public Short getLogicalScore() {
		return logicalScore;
	}

	public void setLogicalScore(Short logicalScore) {
		this.logicalScore = logicalScore;
	}

	public Short getTechnicalScore() {
		return technicalScore;
	}

	public void setTechnicalScore(Short technicalScore) {
		this.technicalScore = technicalScore;
	}

	public Short getProgramScore() {
		return programScore;
	}

	public void setProgramScore(Short programScore) {
		this.programScore = programScore;
	}

	public Integer getTotalScore() {
		return totalScore;
	}

	public void setTotalScore(Integer totalScore) {
		this.totalScore = totalScore;
	}

}
