package com.example.online_examination.service;

import java.util.Map;

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

	public Map<String, Short> checkAnswer(AnswerDTO ans, Question question, Student student,
			Map<String, Short> scores) {

		short logical = scores.get("countLogical");
		short technical = scores.get("countTechnical");

		switch (question.getCategoryId().getCategoryName()) {
		case "Logical":
			logical += answerRepository.checkLogicalAndTechnical(ans.getQuestionId(), Long.valueOf(ans.getOptionId()))
					.orElse(0);
			break;
		case "Technical":
			technical += answerRepository.checkLogicalAndTechnical(ans.getQuestionId(), Long.valueOf(ans.getOptionId()))
					.orElse(0);
			break;
		case "Programming":
			ProgramCheck newProgramCode = new ProgramCheck();
			newProgramCode.setProgramCode(ans.getOptionId());
			newProgramCode.setQuestion(question);
			newProgramCode.setStudent(student);

			programCheckService.saveProgramCode(newProgramCode);
			break;
		}

		scores.put("countLogical", logical);
		scores.put("countTechnical", technical);

		return scores;

	}
}
