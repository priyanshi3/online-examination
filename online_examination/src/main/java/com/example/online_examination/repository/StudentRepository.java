package com.example.online_examination.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.online_examination.entity.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

	//authentication for valid student
	boolean existsByEmailId(String emailId);

}
