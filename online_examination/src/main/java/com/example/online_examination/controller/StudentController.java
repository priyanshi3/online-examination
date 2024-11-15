package com.example.online_examination.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.online_examination.entity.Student;
import com.example.online_examination.service.StudentService;

@RestController
@RequestMapping("/student")
public class StudentController {

	@Autowired
	private StudentService studentService;
	
	// add details of student
	@PostMapping("/addDetails")
	public String addStudentDetails(@RequestBody Student student) {
		studentService.saveStudent(student);
		return "Student detail added successfully";
	}
	
	// fetch all student details
	@GetMapping("/fetchAll")
	public List<Student> getAllStudents() {
		return studentService.getAllStudents();
	}
	
	// update student details
	
	
	//check for valid student for login
	@PostMapping("/login")
	public Boolean studentExist(@RequestBody Student student) {
		return studentService.studentExist(student.getEmailId().trim());
	}
}
