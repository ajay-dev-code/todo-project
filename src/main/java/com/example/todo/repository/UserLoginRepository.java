package com.example.todo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.todo.Entity.UserLogin;

@Repository
public interface UserLoginRepository extends JpaRepository<UserLogin, Long>{
	Optional<UserLogin> findByEmail(String email);
}
