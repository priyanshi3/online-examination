package com.example.online_examination.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.online_examination.entity.Exam;
import com.example.online_examination.repository.ExamRepository;

@Service
public class ExamService {

	@Autowired
	private ExamRepository examRepository;

	public Exam addExam(Exam exam) {
		return examRepository.save(exam);
	}

	public List<Exam> getAllExams() {
		return examRepository.findAll();
	}

	public void activateDeactivateDeleteExam(Long examId, String operation) {
		switch (operation) {
		case "activate":
			Optional<Exam> activeExam = examRepository.findByActive(true);
			if (activeExam.isPresent()) {
				Exam deactivate = activeExam.get();
				deactivate.setActive(false);
				examRepository.save(deactivate);
			}
			Exam activate = examRepository.findById(examId).orElseThrow(() -> new RuntimeException("Exam not found"));
			activate.setActive(true);
			examRepository.save(activate);
			break;
		case "deactivate":
			Exam deactivate = examRepository.findById(examId).orElseThrow(() -> new RuntimeException("Exam not found"));
			deactivate.setActive(false);
			examRepository.save(deactivate);
			break;
		case "delete":
			Optional<Exam> delete = examRepository.findById(examId);
			if (delete.isPresent()) {
				examRepository.deleteById(examId);
			}
			break;
		}
	}

	public Optional<Exam> fetchActiveExam() {
		return examRepository.findByActive(true);
	}

}
