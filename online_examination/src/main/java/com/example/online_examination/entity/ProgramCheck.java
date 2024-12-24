package com.example.online_examination.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class ProgramCheck {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "program_check_ID")
	private Long programCheckId;

	@Column(name = "program_code", nullable = false)
	private String programCode;

	@ManyToOne
	@JoinColumn(name = "question_ID", nullable = false)
	private Question question;

	@ManyToOne
	@JoinColumn(name = "student_ID", nullable = false)
	private Student student;

	@Column(name = "marks")
	private Short marks;

	public ProgramCheck() {
		super();
		// TODO Auto-generated constructor stub
	}

	public ProgramCheck(Long programCheckId, String programCode, Question question, Student student, Short marks) {
		super();
		this.programCheckId = programCheckId;
		this.programCode = programCode;
		this.question = question;
		this.student = student;
		this.marks = marks;
	}

	public Long getProgramCheckId() {
		return programCheckId;
	}

	public void setProgramCheckId(Long programCheckId) {
		this.programCheckId = programCheckId;
	}

	public String getProgramCode() {
		return programCode;
	}

	public void setProgramCode(String programCode) {
		this.programCode = programCode;
	}

	public Question getQuestion() {
		return question;
	}

	public void setQuestion(Question questionId) {
		this.question = questionId;
	}

	public Student getStudent() {
		return student;
	}

	public void setStudent(Student studentId) {
		this.student = studentId;
	}

	public Short getMarks() {
		return marks;
	}

	public void setMarks(Short marks) {
		this.marks = marks;
	}

}
