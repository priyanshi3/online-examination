package com.example.online_examination.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.online_examination.entity.Options;
import com.example.online_examination.entity.OptionsDTO;
import com.example.online_examination.entity.Question;
import com.example.online_examination.repository.QuestionRepository;
import com.example.online_examination.service.OptionsService;

@RestController
@RequestMapping("/options")
public class OptionsController {

	@Autowired
	private OptionsService optionsService;

	@Autowired
	private QuestionRepository questionRepository;

	@PostMapping("/addOption")
	public void addOptions(@RequestBody OptionsDTO optionsDTO) {

		// created Data Transfer Object class to convert Long to Question
		Question question = questionRepository.findById(optionsDTO.getQuestionId())
				.orElseThrow(() -> new RuntimeException("QuestionID not found"));

		Options newOption = new Options();
		newOption.setQuestionId(question);
		newOption.setOptionText(optionsDTO.getOptionText());

		optionsService.addOptions(newOption);
	}
}
