package com.example.online_examination.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.online_examination.entity.Options;
import com.example.online_examination.entity.Question;
import com.example.online_examination.repository.OptionsRepository;
import com.example.online_examination.repository.QuestionRepository;

@Service
public class OptionsService {

	@Autowired
	private OptionsRepository optionsRepository;

	@Autowired
	private QuestionRepository questionRepository;

	public Options addOptions(Options options) {
		return optionsRepository.save(options);
	}

	public Options getOptionIdByText(String optionText, Long questionId) {

		// From questionId fetch Question object
		Optional<Question> question = questionRepository.findById(questionId);

		if (!question.isPresent()) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found with ID: " + questionId);
		}

		// Pass Question object to find option
		Optional<Options> option = optionsRepository.findByOptionTextAndQuestionId(optionText, question.get());
		if (option.isPresent()) {
			return option.get();
		} else {
			throw new ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND,
					"Option not found with text: " + optionText);
		}
	}

}
