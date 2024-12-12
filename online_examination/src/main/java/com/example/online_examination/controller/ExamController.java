package com.example.online_examination.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.online_examination.entity.Exam;
import com.example.online_examination.service.ExamService;

@RestController
@RequestMapping("/exam")
public class ExamController {

	@Autowired
	private ExamService examService;

	@PostMapping("/createExam")
	public Exam addExam(@RequestBody Exam exam) {
		System.out.println(exam.getPassingCriteria());
		if (exam.getPassingCriteria() == null) {
			throw new IllegalArgumentException("Passing criteria cannot be null.");
		}
		return examService.addExam(exam);
	}

}
