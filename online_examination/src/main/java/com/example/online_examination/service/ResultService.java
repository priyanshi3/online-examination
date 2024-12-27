package com.example.online_examination.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.online_examination.entity.Result;
import com.example.online_examination.repository.ResultRepository;

@Service
public class ResultService {

	@Autowired
	private ResultRepository resultRepository;

	public List<Result> fetchAllByExam(Long examId) {
		return resultRepository.findAllByExam_ExamId(examId);
	}

}