package com.example.online_examination.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.online_examination.entity.Student;
import com.example.online_examination.repository.StudentRepository;

@Service
public class StudentService {
	
	@Autowired 
	private StudentRepository studentRepository;

	public Student saveStudent(Student student) {
		return studentRepository.save(student);
	}

	public List<Student> getAllStudents() {
		// TODO Auto-generated method stub
		return studentRepository.findAll();
	}

	public Boolean studentExist(String emailId) {
		// TODO Auto-generated method stub
		return studentRepository.existsByEmailId(emailId);
	}

	public Student updateStudent(Long studentId, Student student) {
		Optional<Student> std = studentRepository.findById(studentId);
		
		if (std.isEmpty()) {
			throw new ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Student not found");
		}
		return studentRepository.save(student);
	}
	
}
