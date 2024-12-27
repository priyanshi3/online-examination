package com.example.online_examination.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.online_examination.entity.Exam;
import com.example.online_examination.entity.ProgramCheck;
import com.example.online_examination.entity.Result;
import com.example.online_examination.repository.ExamRepository;
import com.example.online_examination.repository.ProgramCheckRepository;
import com.example.online_examination.repository.ResultRepository;

@Service
public class ProgramCheckService {

	@Autowired
	private ProgramCheckRepository programCheckRepository;

	@Autowired
	private ExamRepository examRepository;

	@Autowired
	private ResultRepository resultRepository;

	public ProgramCheck saveProgramCode(ProgramCheck programCheck) {
		return programCheckRepository.save(programCheck);
	}

	public List<ProgramCheck> fecthAllToCheck() {
		System.out.println("=============================================");
		System.out.println(programCheckRepository.findByMarksIsNullOrderByQuestionAsc());
		return programCheckRepository.findByMarksIsNullOrderByQuestionAsc();
	}

	public void updateMarks(Long programCheckId, Long examId, Short marks) {

		// set marks
		Optional<ProgramCheck> prog = programCheckRepository.findById(programCheckId);
		if (prog.isEmpty()) {
			throw new RuntimeException("Program not found");
		}

		ProgramCheck programCheck = prog.get();
		programCheck.setMarks(marks);

		ProgramCheck updatedprogramCheck = programCheckRepository.save(programCheck);

		// update result
		Optional<Exam> exam = examRepository.findById(examId);
		if (exam.isEmpty()) {
			throw new RuntimeException("Exam not found");
		}

		Optional<Result> res = resultRepository.findByExam_ExamIdAndStudent_StudentId(examId,
				updatedprogramCheck.getStudent().getStudentId());
		if (res.isEmpty()) {
			throw new RuntimeException("Result not found");
		}

		Result result = res.get();
		int total = updatedprogramCheck.getMarks() + result.getLogicalScore() + result.getLogicalScore();
		result.setProgramScore(marks);
		result.setTotalScore(total);
		resultRepository.save(result);

		System.out.println("program : " + updatedprogramCheck.getMarks() + "total : "
				+ (updatedprogramCheck.getMarks() + result.getLogicalScore() + result.getLogicalScore()) + "logical: "
				+ result.getLogicalScore() + "technical: " + result.getTechnicalScore());
	}

}
