package com.example.online_examination.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.online_examination.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Short> {

}
