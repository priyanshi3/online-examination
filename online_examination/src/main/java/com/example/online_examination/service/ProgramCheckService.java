package com.example.online_examination.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.online_examination.entity.ProgramCheck;
import com.example.online_examination.repository.ProgramCheckRepository;

@Service
public class ProgramCheckService {

	@Autowired
	private ProgramCheckRepository programCheckRepository;

	public void saveProgramCode(ProgramCheck programCheck) {
		programCheckRepository.save(programCheck);
	}

	public List<ProgramCheck> fecthAllToCheck() {
		return programCheckRepository.findByMarksIsNullOrderByQuestionAsc();
	}

	public void updateMarks(Long programCheckId, Short marks) {
		Optional<ProgramCheck> prog = programCheckRepository.findById(programCheckId);
		if (prog.isEmpty()) {
			throw new ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Program not found");
		}

		ProgramCheck updatedProgramCheck = prog.get();
		updatedProgramCheck.setMarks(marks);

		programCheckRepository.save(updatedProgramCheck);
	}

}
