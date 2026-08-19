package com.example.todo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.todo.Entity.UserLogin;
import com.example.todo.repository.UserLoginRepository;

@Service
public class UserLoginService {
	@Autowired
	private UserLoginRepository userlogin;

	public UserLogin createUser(UserLogin userLogin) {
		return userlogin.save(userLogin);
	}

	public List<UserLogin> getAll() {
		return userlogin.findAll();
	}

	public UserLogin getById(Long id) {
		return userlogin.findById(id).orElseThrow(() -> new RuntimeException("user not found" + id));
	}

	public Optional<UserLogin> getByEmail(String email) {
		return userlogin.findByEmail(email);
	}
}
