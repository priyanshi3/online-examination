package com.example.online_examination.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.online_examination.entity.Employee;
import com.example.online_examination.service.EmployeeService;

@RestController
@RequestMapping("/employee")
public class EmployeeController {

	@Autowired 
	private EmployeeService employeeService;
	
	//check for valid employee for login
	@PostMapping("/login")
	public Boolean studentExist(@RequestBody Employee employee) {
		return employeeService.employeeExist(employee.getEmailId().trim());
	}

}
