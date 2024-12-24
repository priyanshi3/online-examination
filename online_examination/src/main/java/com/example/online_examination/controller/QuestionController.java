package com.example.online_examination.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.online_examination.entity.Category;
import com.example.online_examination.entity.Difficulty;
import com.example.online_examination.entity.ExamQuestion;
import com.example.online_examination.entity.Question;
import com.example.online_examination.repository.CategoryRepository;
import com.example.online_examination.repository.DifficultyRepository;
import com.example.online_examination.repository.ExamQuestionRepository;
import com.example.online_examination.service.QuestionService;

@RestController
@RequestMapping("/question")
public class QuestionController {

	@Autowired
	private QuestionService questionService;

	@Autowired
	private CategoryRepository categoryRepository;

	@Autowired
	private DifficultyRepository difficultyRepository;

	@Autowired
	private ExamQuestionRepository examQuestionRepository;

	@PostMapping("/addQuestion")
	public Question addQuestion(@RequestBody Question question) {

		Category category = categoryRepository.findById(question.getCategoryId().getCategoryId())
				.orElseThrow(() -> new RuntimeException("Category not found"));
		question.setCategoryId(category);

		if (question.getDifficultyLevelId() != null) {
			Difficulty difficultyLevel = difficultyRepository
					.findById(question.getDifficultyLevelId().getDifficultyLevelId())
					.orElseThrow(() -> new RuntimeException("Difficulty level not found"));
			question.setDifficultyLevelId(difficultyLevel);
		}

		Question newQuestion = questionService.addQuestion(question);
		return newQuestion;
	}

	// fetch questions to create exam
	@GetMapping("/fetchToCreateExam")
	public List<Question> fetchToCreateExam(@RequestParam int categoryId,
			@RequestParam(required = false) int difficultyLevelId) {

		if (difficultyLevelId == 0) {
			return questionService.findByCategory(categoryId);
		} else {
			return questionService.findByCategoryAndDifficulty(categoryId, difficultyLevelId);
		}
	}

	// fetch questions for exam from active exam
	@GetMapping("/fetchQuestionForExam")
	public List<Question> fetchQuestionForExam(@RequestParam int examId) {
		List<ExamQuestion> questionIds = examQuestionRepository.fetchForExam(examId);

		List<Question> questions = new ArrayList<>();
		for (ExamQuestion question : questionIds) {
			questions.add(question.getQuestion());
		}
		return questions;
	}
}