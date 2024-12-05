package com.example.online_examination.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.online_examination.entity.Question;
import com.example.online_examination.repository.QuestionRepository;

@RestController
@RequestMapping("/question")
public class QuestionController {

	@Autowired
	private QuestionRepository questionRepository;

	@PostMapping("/addQuestion")
	public void addQuestion(Question question) {
		questionRepository.save(question);
	}

}
