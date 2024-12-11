package com.example.online_examination.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Program {

	@Id
	@Column(name = "program_solution_ID")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long programSolutionId;

	@Column(name = "program_solution")
	private String programSolution;

	@ManyToOne
	@JoinColumn(name = "question_ID", nullable = false)
	private Question questionId;

	public Program() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Program(Long programSolutionId, String programSolution, Question questionId) {
		super();
		this.programSolutionId = programSolutionId;
		this.programSolution = programSolution;
		this.questionId = questionId;
	}

	public Long getProgramSolutionId() {
		return programSolutionId;
	}

	public void setProgramSolutionId(Long programSolutionId) {
		this.programSolutionId = programSolutionId;
	}

	public String getProgramSolution() {
		return programSolution;
	}

	public void setProgramSolution(String programSolution) {
		this.programSolution = programSolution;
	}

	public Question getQuestionId() {
		return questionId;
	}

	public void setQuestionId(Question questionId) {
		this.questionId = questionId;
	}

}
