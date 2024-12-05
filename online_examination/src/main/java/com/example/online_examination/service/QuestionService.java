package com.example.online_examination.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.online_examination.entity.Question;
import com.example.online_examination.repository.QuestionRepository;

@Service
public class QuestionService {

	@Autowired
	private QuestionRepository questionRepository;

	public Question saveQuestion(Question question) {
		return questionRepository.save(question);
	}
}
