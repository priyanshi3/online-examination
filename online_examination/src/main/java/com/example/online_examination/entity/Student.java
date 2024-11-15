package com.example.online_examination.entity;

import jakarta.persistence.*;

@Entity
@Table(name="student")
public class Student {
	
	@Id
	@Column(name="student_ID")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long studentId ;	//  primary key
	
	@Column(name="first_name")
	private String firstName;
	
	@Column(name="last_name")
	private String lastName;
	
	@Column(name="email_ID")
	private String emailId;
	
	@Column(name="phone_number")
	private Long phoneNumber;
	
	@Column(name="CPI")
	private Double cpi;
	
	public Student() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Student(Long studentId, String firstName, String lastName, String emailId, Long phoneNumber, Double cpi) {
		super();
		this.studentId = studentId;
		this.firstName = firstName;
		this.lastName = lastName;
		this.emailId = emailId;
		this.phoneNumber = phoneNumber;
		this.cpi = cpi;
	}

	public Long getStudentId() {
		return studentId;
	}

	public void setStudentId(Long studentId) {
		this.studentId = studentId;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmailId() {
		return emailId;
	}

	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}

	public Long getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(Long phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public Double getCpi() {
		return cpi;
	}

	public void setCpi(Double cpi) {
		this.cpi = cpi;
	}

	
}