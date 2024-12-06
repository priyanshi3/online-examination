package com.example.online_examination.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.online_examination.entity.Options;

@Repository
public interface OptionsRepository extends JpaRepository<Options, Long> {

	// find option Id by option Text to set option Id to answer
	Optional<Options> findByOptionText(String optionText);
}
