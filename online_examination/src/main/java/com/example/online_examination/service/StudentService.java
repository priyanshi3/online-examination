package com.example.online_examination.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
		return studentRepository.findAll();
	}

	public Boolean studentExist(String emailId) {
		return studentRepository.existsByEmailId(emailId);
	}

	public Student updateStudent(Long studentId, Student student) {
		Optional<Student> std = studentRepository.findById(studentId);

		if (std.isEmpty()) {
			throw new ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Student not found");
		}
		Student updatedStudent = std.get();
        updatedStudent.setFirstName(student.getFirstName());
        updatedStudent.setLastName(student.getLastName());
        updatedStudent.setEmailId(student.getEmailId());
        updatedStudent.setPhoneNumber(student.getPhoneNumber());
        updatedStudent.setCpi(student.getCpi());
        return studentRepository.save(updatedStudent);
	}

}
