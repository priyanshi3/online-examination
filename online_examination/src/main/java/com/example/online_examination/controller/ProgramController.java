package com.example.online_examination.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.online_examination.entity.Program;
import com.example.online_examination.entity.ProgramDTO;
import com.example.online_examination.entity.Question;
import com.example.online_examination.repository.QuestionRepository;
import com.example.online_examination.service.ProgramService;

@RestController
@RequestMapping("/program")
public class ProgramController {

	@Autowired
	private ProgramService programService;

	@Autowired
	private QuestionRepository questionRepository;

	@PostMapping("/addProgram")
	public void addProgram(@RequestBody ProgramDTO programDTO) {

		// created Data Transfer Object class to convert Long to Question
		Question question = questionRepository.findById(programDTO.getQuestionId())
				.orElseThrow(() -> new RuntimeException("QuestionID not found"));

		Program newProgramSolution = new Program();
		newProgramSolution.setProgramSolution(programDTO.getProgramSolution());
		newProgramSolution.setQuestionId(question);

		programService.addProgram(newProgramSolution);
	}

	@GetMapping("/fetchByQuestion")
	public Program fetchByQuestionId(@RequestParam Long questionId) {
		System.out.println("============================");
		System.out.println(programService.fetchByQuestionId(questionId));
		return programService.fetchByQuestionId(questionId);
	}
}
