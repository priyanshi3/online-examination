package com.example.online_examination.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.online_examination.entity.Employee;
import com.example.online_examination.repository.EmployeeRepository;

@Service
public class EmployeeService {

	@Autowired
	private EmployeeRepository employeeRepository;

	public Employee employeeExist(String emailId) {
		return employeeRepository.existsByEmailId(emailId);
	}

}
