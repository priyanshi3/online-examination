package com.example.online_examination.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
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

	public Student studentExist(String emailId) {
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

	public void importStudents(MultipartFile file) throws IOException {
		List<Student> students = new ArrayList<>();
		Workbook workbook = new XSSFWorkbook(file.getInputStream());
		Sheet sheet = workbook.getSheetAt(0);

		// expected column names
		String[] expectedHeaders = { "Sr. No.", "First Name", "Last Name", "Email", "Phone Number", "CPI" };

		// Read the header row
		Row headerRow = sheet.getRow(0);
		Map<Integer, String> headerMap = new HashMap<>();

		for (Cell cell : headerRow) {
			headerMap.put(cell.getColumnIndex(), cell.getStringCellValue().trim());
		}

		// compare expected headers
		for (int i = 0; i < expectedHeaders.length; i++) {
			if (!expectedHeaders[i].equalsIgnoreCase(headerMap.get(i))) {
				throw new IllegalArgumentException("Invalid header at column " + (i + 1) + ": expected '"
						+ expectedHeaders[i] + "' but found '" + headerMap.get(i) + "'");
			}
		}

		// process data row by row
		for (Row row : sheet) {

			if (row.getRowNum() == 0) {
				continue; // Skip header row
			}

			Student student = new Student();

			for (int colIndex = 1; colIndex <= 5; colIndex++) {
				Cell cell = row.getCell(colIndex);

				// Skip invalid entries
				if (cell == null || cell.getCellType() == CellType.BLANK
						|| (cell.getCellType() == CellType.STRING && cell.getStringCellValue().trim().isEmpty())) {
					continue;
				}

				switch (colIndex) {
				case 1:
					student.setFirstName(cell.getStringCellValue().trim());
					break;
				case 2:
					student.setLastName(cell.getStringCellValue().trim());
					break;
				case 3:
					student.setEmailId(cell.getStringCellValue().trim());
					break;
				case 4:
					try {
						if (cell.getCellType() == CellType.NUMERIC) {
							Long phoneNumber = (long) cell.getNumericCellValue();
							student.setPhoneNumber(phoneNumber);
						} else if (cell.getCellType() == CellType.STRING) {
							String phoneNumberStr = cell.getStringCellValue().trim();

							// Check if the string is numeric
							if (!phoneNumberStr.matches("\\d+")) { // matches sequence of numeric digits
								System.err.println("Invalid phone number format at row " + (row.getRowNum() + 1));
								break;
							}

							Long phoneNumber = Long.parseLong(phoneNumberStr);
							student.setPhoneNumber(phoneNumber);
						} else {
							System.err.println("Unsupported phone number format at row " + (row.getRowNum() + 1));
						}
					} catch (Exception e) {
						System.err.println("Unexpected error processing phone number at row " + (row.getRowNum() + 1)
								+ ": " + e.getMessage());
					}
					break;
				case 5:
					if (cell.getCellType() == CellType.NUMERIC) {
						student.setCpi(cell.getNumericCellValue());
					} else {
						System.err.println("Invalid CPI value at row " + row.getRowNum());
					}
					break;
				}
			}

			if (student.getFirstName() != null && !student.getFirstName().isEmpty() && student.getLastName() != null
					&& !student.getLastName().isEmpty() && student.getEmailId() != null
					&& !student.getEmailId().isEmpty() && student.getPhoneNumber() != null
					&& student.getPhoneNumber() > 0 && student.getCpi() != null && student.getCpi() >= 0.0) {
				students.add(student);
			}
		}
		workbook.close();
		studentRepository.saveAll(students);
	}

}
