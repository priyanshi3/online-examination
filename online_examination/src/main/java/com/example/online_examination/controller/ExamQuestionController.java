package com.example.online_examination.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.online_examination.entity.Exam;
import com.example.online_examination.entity.ExamQuestion;
import com.example.online_examination.entity.ExamQuestionDTO;
import com.example.online_examination.entity.Question;
import com.example.online_examination.repository.ExamRepository;
import com.example.online_examination.repository.QuestionRepository;
import com.example.online_examination.service.ExamQuestionService;

@RestController
@RequestMapping("/examQuestion")
public class ExamQuestionController {

	@Autowired
	private ExamQuestionService examQuestionService;

	@Autowired
	private QuestionRepository questionRepository;

	@Autowired
	private ExamRepository examRepository;

	@PostMapping("/addExamQuestion")
	public void addExamQuestion(@RequestBody ExamQuestionDTO examQuestionDTO) {

		Exam exam = examRepository.findById(examQuestionDTO.getExamId())
				.orElseThrow(() -> new RuntimeException("ExamID not found"));

		Question question = questionRepository.findById(examQuestionDTO.getQuestionId())
				.orElseThrow(() -> new RuntimeException("QuestionID not found"));

		ExamQuestion newExamQuestion = new ExamQuestion();
		newExamQuestion.setExam(exam);
		newExamQuestion.setQuestion(question);

		examQuestionService.addExamQuestion(newExamQuestion);
	}

}
