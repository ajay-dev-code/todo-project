package com.example.todo.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.todo.Entity.UserLogin;
import com.example.todo.Util.JwtUtil;
import com.example.todo.repository.UserLoginRepository;
import com.example.todo.service.UserLoginService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

	private final UserLoginService service;
	private final UserLoginRepository userrepo;
	private final PasswordEncoder passwordEncoder;
	private final JwtUtil jwtUtil;

	
	private ResponseEntity<Map<String, String>> message(String text, HttpStatus status) {
		return new ResponseEntity<>(Map.of("message", text), status);
	}

	@PostMapping("/register")
	public ResponseEntity<Map<String, String>> registerUser(@RequestBody Map<String, String> body) {
		String email = body.get("email");
		String password = passwordEncoder.encode(body.get("password"));

		if (userrepo.findByEmail(email).isPresent()) {
			return message("That email is already registered. Please sign in instead.", HttpStatus.CONFLICT);
		}

		service.createUser(UserLogin.builder().email(email).password(password).build());
		return message("Account created successfully.", HttpStatus.CREATED);
	}

	@PostMapping("/login")
	public ResponseEntity<?> loginUser(@RequestBody Map<String, String> body) {
		String email = body.get("email");
		String password = body.get("password");

		var UserLoginOptional = userrepo.findByEmail(email);
		if (UserLoginOptional.isEmpty()) {
			return message("This email is not registered yet. Please create an account first.",
					HttpStatus.UNAUTHORIZED);
		}
		UserLogin userLogin = UserLoginOptional.get();
		if (!passwordEncoder.matches(password, userLogin.getPassword())) {
			return message("Incorrect password. Please try again.", HttpStatus.UNAUTHORIZED);
		}
		String token = jwtUtil.genrateToken(email);

		return ResponseEntity.ok(Map.of("token", token));
	}

}
