package com.example.online_examination.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.online_examination.entity.Category;
import com.example.online_examination.repository.CategoryRepository;

@Service
public class CategoryService {

	@Autowired 
	private CategoryRepository categoryRepository;
	
	public List<Category> getAllCategory() {
		return categoryRepository.findAll();
	}
}
