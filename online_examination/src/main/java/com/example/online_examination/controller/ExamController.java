package com.example.online_examination.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
		return examService.addExam(exam);
	}

	@GetMapping("/fetchAll")
	public List<Exam> getAllExams() {
		return examService.getAllExams();
	}

	// to activate exam by employee
	@PutMapping("/manageExam/{id}")
	public void activateExam(@PathVariable("id") Long examId, @RequestParam String operation) {
		examService.activateDeactivateDeleteExam(examId, operation);
	}

	// to get active exam for student exam
	@PostMapping("/fetchActiveExam")
	public Optional<Exam> fetchActiveExam() {
		return examService.fetchActiveExam();
	}

}
