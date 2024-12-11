package com.example.online_examination.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.online_examination.entity.Program;
import com.example.online_examination.repository.ProgramRepository;

@Service
public class ProgramService {

	@Autowired
	private ProgramRepository programRepository;

	public Program addProgram(Program program) {
		return programRepository.save(program);
	}

}
