package com.example.online_examination.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.online_examination.entity.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

	// authentication for valid employee
	@Query("SELECT e FROM Employee e WHERE e.emailId = :emailId")
	Employee existsByEmailId(String emailId);
}
