package com.example.online_examination.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.online_examination.entity.Employee;
import com.example.online_examination.repository.EmployeeRepository;

@Service
public class EmployeeService {

	@Autowired
	private EmployeeRepository employeeRepository;

	public Employee employeeExist(String emailId) {
		return employeeRepository.existsByEmailId(emailId);
	}

	public Employee addEmployee(Employee employee) {
		if (employeeRepository.existsByEmailId(employee.getEmailId()) != null) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Employee already exists");
		}
		return employeeRepository.save(employee);
	}

}
