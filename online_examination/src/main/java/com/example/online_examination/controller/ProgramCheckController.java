package com.example.online_examination.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.online_examination.entity.ProgramCheck;
import com.example.online_examination.service.ProgramCheckService;

@RestController
@RequestMapping("/programCheck")
public class ProgramCheckController {

	@Autowired
	private ProgramCheckService programCheckService;

	// fetch to set marks
	@GetMapping("/fetchAll")
	public List<ProgramCheck> fecthAllToCheck() {
		return programCheckService.fecthAllToCheck();
	}

	// update marks
	@PutMapping("/update/{id}")
	public void updateProgramCheck(@PathVariable("id") Long programCheckId, @RequestBody Short marks) {
		programCheckService.updateMarks(programCheckId, marks);
	}
}
