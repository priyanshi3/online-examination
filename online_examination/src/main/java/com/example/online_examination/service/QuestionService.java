package com.example.online_examination.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.online_examination.entity.Answer;
import com.example.online_examination.entity.Options;
import com.example.online_examination.entity.Question;
import com.example.online_examination.repository.AnswerRepository;
import com.example.online_examination.repository.OptionsRepository;
import com.example.online_examination.repository.QuestionRepository;

@Service
public class QuestionService {

	@Autowired
	private QuestionRepository questionRepository;

	@Autowired
	private OptionsRepository optionsRepository;

	@Autowired
	private AnswerRepository answerRepository;

	public Question addQuestion(Question question) {
		return questionRepository.save(question);
	}

	public Options addOption(Options options) {
		return optionsRepository.save(options);
	}

	public Answer addAnswer(Answer answer) {
		return answerRepository.save(answer);
	}

	// fetch questions to create exam
	public List<Question> findByCategory(Integer categoryId) {
		return questionRepository.findByCategory(categoryId);
	}

	public List<Question> findByCategoryAndDifficulty(Integer categoryId, Integer difficultyLevelId) {
		return questionRepository.findByCategoryAndDifficulty(categoryId, difficultyLevelId);
	}

}
