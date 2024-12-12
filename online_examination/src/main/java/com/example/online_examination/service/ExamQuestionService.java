package com.example.online_examination.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.online_examination.entity.ExamQuestion;
import com.example.online_examination.repository.ExamQuestionRepository;

@Service
public class ExamQuestionService {

	@Autowired
	private ExamQuestionRepository examQuestionRepository;

	public ExamQuestion addExamQuestion(ExamQuestion examQuestion) {
		return examQuestionRepository.save(examQuestion);
	}
}
