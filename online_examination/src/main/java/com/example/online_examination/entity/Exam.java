package com.example.online_examination.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Exam {

	@Id
	@Column(name = "exam_ID")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long examId;

	@Column(name = "passing_criteria", nullable = false)
	private Double passingCriteria;

	@Column(name = "duration", nullable = false)
	private Short duration;

	@Column(name = "active", nullable = false)
	private Boolean active;

	public Exam() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Exam(Long examId, Double passingCriteria, Short duration, Boolean active) {
		super();
		this.examId = examId;
		this.passingCriteria = passingCriteria;
		this.duration = duration;
		this.active = active;
	}

	public Long getExamId() {
		return examId;
	}

	public void setExamId(Long examId) {
		this.examId = examId;
	}

	public Double getPassingCriteria() {
		return passingCriteria;
	}

	public void setPassingCriteria(Double passingCriteria) {
		this.passingCriteria = passingCriteria;
	}

	public Short getDuration() {
		return duration;
	}

	public void setDuration(Short duration) {
		this.duration = duration;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

}
