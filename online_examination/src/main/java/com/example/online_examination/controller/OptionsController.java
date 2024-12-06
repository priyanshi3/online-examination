package com.example.online_examination.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.online_examination.entity.Options;
import com.example.online_examination.service.OptionsService;

@RestController
@RequestMapping("/options")
public class OptionsController {

	@Autowired
	private OptionsService optionsService;

	@PostMapping("/addOption")
	public Options addOptions(@RequestBody Options options) {
		return optionsService.saveOptions(options);
	}

//	@PostMapping("/findOptionByText")
//	public Long findOptionIdByText(@RequestBody String optionText) {
//		return optionsService.getOptionIdByText(optionText).getOptionId();
//	}
}
