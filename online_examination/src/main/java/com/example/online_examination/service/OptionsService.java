package com.example.online_examination.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.online_examination.entity.Options;
import com.example.online_examination.repository.OptionsRepository;

@Service
public class OptionsService {

	@Autowired
	private OptionsRepository optionsRepository;

	public Options saveOptions(Options options) {
		return optionsRepository.save(options);
	}

//	public Options getOptionIdByText(String optionText) {
//		Optional<Options> option = optionsRepository.findByOptionText(optionText);
//
//		if (option.isPresent()) {
//			return option.get();
//		} else {
//			throw new ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND,
//					"Option not found with text: " + optionText);
//		}
//	}
}
