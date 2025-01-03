package com.example.online_examination.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.online_examination.entity.Student;
import com.example.online_examination.service.StudentService;

@RestController
@RequestMapping("/student")
public class StudentController {

	@Autowired
	private StudentService studentService;

	// add details of student
	@PostMapping("/addDetails")
	public void addStudentDetails(@RequestBody Student student) {
		studentService.saveStudent(student);
	}

	// fetch all student details
	@GetMapping("/fetchAll")
	public List<Student> getAllStudents() {
		return studentService.getAllStudents();
	}

	// update student details
	@PutMapping("/update/{id}")
	public Boolean updateStudent(@PathVariable("id") Long studentId, @RequestBody Student student) {
		studentService.updateStudent(studentId, student);
		return true;
	}

	// check for valid student for login
	@PostMapping("/login")
	public Student studentExist(@RequestBody Student student) {
		return studentService.studentExist(student.getEmailId().trim());
	}

	@PostMapping("/import")
	public ResponseEntity<String> importStudents(@RequestParam("file") MultipartFile file) {
		try {
			studentService.importStudents(file);
			return ResponseEntity.ok("File imported successfully");
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error reading Excel file: " + e.getMessage());
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
		}
	}

}
