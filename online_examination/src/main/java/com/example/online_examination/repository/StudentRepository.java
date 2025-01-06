package com.example.online_examination.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.online_examination.entity.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

	// authentication for valid student
	@Query("SELECT s FROM Student s WHERE s.emailId = :emailId ")
	Student existsByEmailId(String emailId);

	// CHeck for duplicate student data
	boolean existsByEmailIdOrPhoneNumber(String emailId, Long phoneNumber);

}
