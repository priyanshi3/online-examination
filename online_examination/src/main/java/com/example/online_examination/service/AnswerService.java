package com.example.online_examination.service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.online_examination.entity.Answer;
import com.example.online_examination.entity.AnswerDTO;
import com.example.online_examination.entity.Category;
import com.example.online_examination.entity.Difficulty;
import com.example.online_examination.entity.Options;
import com.example.online_examination.entity.Program;
import com.example.online_examination.entity.ProgramCheck;
import com.example.online_examination.entity.Question;
import com.example.online_examination.entity.Student;
import com.example.online_examination.repository.AnswerRepository;
import com.example.online_examination.repository.CategoryRepository;
import com.example.online_examination.repository.DifficultyRepository;

@Service
public class AnswerService {

	@Autowired
	private AnswerRepository answerRepository;

	@Autowired
	private ProgramCheckService programCheckService;

	@Autowired
	private CategoryRepository categoryRepository;

	@Autowired
	private DifficultyRepository difficultyRepository;

	@Autowired
	private QuestionService questionService;

	@Autowired
	private OptionsService optionsService;

	@Autowired
	private ProgramService programService;

	public Answer saveAnswer(Answer answer) {
		return answerRepository.save(answer);
	}

	public Map<String, Short> checkAnswer(AnswerDTO ans, Question question, Student student,
			Map<String, Short> scores) {

		short logical = scores.get("countLogical");
		short technical = scores.get("countTechnical");

		switch (question.getCategoryId().getCategoryName()) {
		case "Logical":
			logical += answerRepository.checkLogicalAndTechnical(ans.getQuestionId(), Long.valueOf(ans.getOptionId()))
					.orElse(0);
			break;
		case "Technical":
			technical += answerRepository.checkLogicalAndTechnical(ans.getQuestionId(), Long.valueOf(ans.getOptionId()))
					.orElse(0);
			break;
		case "Programming":
			ProgramCheck newProgramCode = new ProgramCheck();
			newProgramCode.setProgramCode(ans.getOptionId());
			newProgramCode.setQuestion(question);
			newProgramCode.setStudent(student);

			programCheckService.saveProgramCode(newProgramCode);
			break;
		}

		scores.put("countLogical", logical);
		scores.put("countTechnical", technical);

		return scores;

	}

	private Boolean checkIfValidCellValue(Cell cell) {
		if (cell == null || cell.getCellType() == CellType.BLANK
				|| (cell.getCellType() == CellType.STRING && cell.getStringCellValue().trim().isEmpty())) {
			return false;
		}
		return true;
	}

	public void importQuestions(MultipartFile file) throws IOException {

		Workbook workbook = new XSSFWorkbook(file.getInputStream());
		Sheet sheet = workbook.getSheetAt(0);

		// expected column names
		String[] expectedHeaders = { "Sr. No.", "Question", "Category", "Difficulty Level", "Option 1", "Option 2",
				"Option 3", "Option 4", "Answer" };

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

			Question question = new Question();
			Answer answer = new Answer();
			Question addedQuestion = null;
			try {
				if (checkIfValidCellValue(row.getCell(1)) && checkIfValidCellValue(row.getCell(2))) {
					// Check category
					Optional<Category> categoryUsingName = categoryRepository
							.findByCategoryName(StringUtils.capitalize(row.getCell(2).getStringCellValue().trim()));

					if (categoryUsingName.isPresent()) {
						Category category = categoryUsingName.get();

						// Check if question already exists
						boolean questionExists = questionService
								.existsByQuestionAndCategory(row.getCell(1).getStringCellValue().trim(), category);
						System.out.println("================" + questionExists);
						if (questionExists) {
							System.out.println("Question already exists: " + row.getCell(1).getStringCellValue());
							continue;
						}

						// Check difficulty level if category is difficulty
						if ("Programming".equals(category.getCategoryName()) && checkIfValidCellValue(row.getCell(3))) {
							Optional<Difficulty> difficultyUsingName = difficultyRepository.findByDifficultyLevel(
									StringUtils.capitalize(row.getCell(3).getStringCellValue().trim()));

							if (difficultyUsingName.isPresent()) {
								Difficulty difficulty = difficultyUsingName.get();
								question.setDifficultyLevelId(difficulty);
								System.out.println(difficulty.getDifficultyLevelId());
							}
						}
						question.setCategoryId(category);
						question.setQuestion(row.getCell(1).getStringCellValue().trim());

						// Check if sufficient options are available and questions are MCQ
						if (checkIfValidCellValue(row.getCell(4)) && checkIfValidCellValue(row.getCell(5))) {
							addedQuestion = questionService.addQuestion(question);

							// Add all the options available
							for (int i = 4; i <= 7; i++) {
								if (checkIfValidCellValue(row.getCell(i))) {
									// Add options entry in database
									Options option = new Options();
									option.setQuestionId(addedQuestion);
									option.setOptionText(row.getCell(i).getStringCellValue().trim());
									optionsService.addOptions(option);
								}
							}
							// Add answer
							if (checkIfValidCellValue(row.getCell(8))) {
								Options answerOption = optionsService.getOptionIdByText(
										row.getCell(8).getStringCellValue().trim(), addedQuestion.getQuestionId());
								answer.setOptionId(answerOption);
								answer.setQuestionId(addedQuestion);
								answerRepository.save(answer);
							}
						}

						// If category is programming then set its answer
						if (checkIfValidCellValue(row.getCell(8))) {
							if ("Programming".equals(category.getCategoryName())) {
								addedQuestion = questionService.addQuestion(question);
								Program programSolution = new Program();
								programSolution.setProgramSolution(row.getCell(8).getStringCellValue().trim());
								programSolution.setQuestionId(addedQuestion);
								programService.addProgram(programSolution);
							}
						}
					}
				}
			} catch (Exception e) {
				throw new RuntimeException("Error processing: " + e.getMessage(), e);
			}
		}
		workbook.close();
	}
}
