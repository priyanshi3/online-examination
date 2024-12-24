package com.example.online_examination.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.online_examination.entity.Answer;
import com.example.online_examination.entity.AnswerDTO;
import com.example.online_examination.entity.ProgramCheck;
import com.example.online_examination.entity.Question;
import com.example.online_examination.entity.Student;
import com.example.online_examination.repository.AnswerRepository;

@Service
public class AnswerService {

	@Autowired
	private AnswerRepository answerRepository;

	@Autowired
	private ProgramCheckService programCheckService;

	public Answer saveAnswer(Answer answer) {
		return answerRepository.save(answer);
	}

	int countLogical = 0;
	int countTechnical = 0;

	public void checkAnswer(AnswerDTO ans, Question question, Student student) {

		switch (question.getCategoryId().getCategoryName()) {
		case "Logical":
			countLogical += answerRepository
					.checkLogicalAndTechnical(ans.getQuestionId(), Long.valueOf(ans.getOptionId())).orElse(0);
			break;
		case "Technical":
			countTechnical += answerRepository
					.checkLogicalAndTechnical(ans.getQuestionId(), Long.valueOf(ans.getOptionId())).orElse(0);
			break;
		case "Programming":
			ProgramCheck newProgramCode = new ProgramCheck();
			newProgramCode.setProgramCode(ans.getOptionId());
			newProgramCode.setQuestion(question);
			newProgramCode.setStudent(student);

			programCheckService.saveProgramCode(newProgramCode);
			break;
		}
		System.out.println("log : " + countLogical + " tech: " + countTechnical);
	}
}
