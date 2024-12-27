package com.example.online_examination.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.online_examination.entity.Result;
import com.example.online_examination.repository.ResultRepository;

@RestController
@RequestMapping("/result")
public class ResultController {

	@Autowired
	private ResultRepository resultRepository;

	@GetMapping("/fetchAllByExam")
	public List<Result> fetchAllByExam(@RequestParam Long examId) {
		return resultRepository.findAllByExam_ExamId(examId);
	}

}
