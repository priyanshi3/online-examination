package com.example.online_examination.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.online_examination.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {

	// For Import questions which will receive category name
	Optional<Category> findByCategoryName(String name);
}
