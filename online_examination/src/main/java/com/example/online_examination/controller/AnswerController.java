package com.example.online_examination.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.online_examination.entity.Answer;
import com.example.online_examination.entity.AnswerDTO;
import com.example.online_examination.entity.Exam;
import com.example.online_examination.entity.Options;
import com.example.online_examination.entity.Question;
import com.example.online_examination.entity.Result;
import com.example.online_examination.entity.Student;
import com.example.online_examination.repository.ExamRepository;
import com.example.online_examination.repository.QuestionRepository;
import com.example.online_examination.repository.ResultRepository;
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

	@Autowired
	private ExamRepository examRepository;

	@Autowired
	private ResultRepository resultRepository;

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
	public String checkAnswer(@RequestBody List<AnswerDTO> answerDTO, @RequestParam("studentId") Long studentId,
			@RequestParam("examId") Long examId) {

		short countLogical = 0;
		short countTechnical = 0;

		Map<String, Short> scores = new HashMap<>();
		scores.put("countLogical", countLogical);
		scores.put("countTechnical", countTechnical);

		Student student = studentRepository.findById(studentId)
				.orElseThrow(() -> new RuntimeException("Student not found"));

		// to check if student has given exam only once
		long resultExists = resultRepository.countByExam_ExamIdAndStudent_StudentId(examId, studentId);
		if (resultExists != 0) {
			return "Exam can be submitted only once";
		}

		// check each answer
		for (AnswerDTO ans : answerDTO) {
			Question question = questionRepository.findById(ans.getQuestionId())
					.orElseThrow(() -> new RuntimeException("QuestionID not found"));

			if (ans.getOptionId() != null) {
				scores = answerService.checkAnswer(ans, question, student, scores);
			}

		}
		System.out.println("log: " + scores.get("countLogical") + " tec: " + scores.get("countTechnical"));

		Exam exam = examRepository.findById(examId).orElseThrow(() -> new RuntimeException("Exam not found"));

		Result result = new Result();
		result.setExam(exam);
		result.setStudent(student);
		result.setLogicalScore(scores.get("countLogical"));
		result.setTechnicalScore(scores.get("countTechnical"));
		result.setTotalScore(scores.get("countLogical") + scores.get("countTechnical"));
		resultRepository.save(result);
		return "success";
	}

}
