package com.example.online_examination.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.online_examination.entity.Answer;
import com.example.online_examination.entity.AnswerDTO;
import com.example.online_examination.entity.Options;
import com.example.online_examination.entity.Question;
import com.example.online_examination.entity.Student;
import com.example.online_examination.repository.QuestionRepository;
import com.example.online_examination.repository.StudentRepository;
import com.example.online_examination.service.AnswerService;
import com.example.online_examination.service.OptionsService;

@RestController
@RequestMapping("/answer")
public class AnswerController {

	@Autowired
	private AnswerService answerService;

	@Autowired
	private QuestionRepository questionRepository;

	@Autowired
	private OptionsService optionsService;

	@Autowired
	private StudentRepository studentRepository;

	@PostMapping("/addAnswer")
	public void addAnswer(@RequestBody AnswerDTO answerDTO) {

		// created Data Transfer Object class to convert Long to Question and String to
		// Options
		Question question = questionRepository.findById(answerDTO.getQuestionId())
				.orElseThrow(() -> new RuntimeException("QuestionID not found"));

		// fetch option ID using option text received from JSON
		Options option = optionsService.getOptionIdByText(answerDTO.getOptionId(), question.getQuestionId());

		Answer newAnswer = new Answer();
		newAnswer.setQuestionId(question);
		newAnswer.setOptionId(option);

		answerService.saveAnswer(newAnswer);
	}

	@PostMapping("/submitAnswer")
	public void checkAnswer(@RequestBody List<AnswerDTO> answerDTO, @RequestParam("studentId") Long studentId) {

		Student student = studentRepository.findById(studentId)
				.orElseThrow(() -> new RuntimeException("Student not found"));

		for (AnswerDTO ans : answerDTO) {
			Question question = questionRepository.findById(ans.getQuestionId())
					.orElseThrow(() -> new RuntimeException("QuestionID not found"));

			if (ans.getOptionId() != null) {
				answerService.checkAnswer(ans, question, student);
			}

		}

	}

}
