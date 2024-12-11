package com.example.online_examination.entity;

public class ProgramDTO {

	private String programSolution;

	private Long questionId;

	public String getProgramSolution() {
		return programSolution;
	}

	public void setProgramSolution(String programSolution) {
		this.programSolution = programSolution;
	}

	public Long getQuestionId() {
		return questionId;
	}

	public void setQuestionId(Long questionId) {
		this.questionId = questionId;
	}

}
