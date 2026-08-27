package com.example.todo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.todo.Entity.Todo;
import com.example.todo.service.TodoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/diary")
public class TodoController {

	@Autowired
	private TodoService todoservice;

	@PostMapping
	public ResponseEntity<Todo> createuser(@Valid @RequestBody Todo todo, Authentication authentication) {

		String email = authentication.getName();

		Todo createTodo = todoservice.createTodos(todo, email);

		return new ResponseEntity<>(createTodo, HttpStatus.CREATED);
	}

	@GetMapping
	public ResponseEntity<List<Todo>> getAllTodo(Authentication authentication) {

		String email = authentication.getName();

		List<Todo> todo = todoservice.getAllTodos(email);

		return ResponseEntity.ok(todo);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Todo> getByTodoId(@PathVariable Long id, Authentication authentication) {

		String email = authentication.getName();

		Todo todo = todoservice.getById(id, email);

		return ResponseEntity.ok(todo);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Todo> updateTodos(@PathVariable Long id, @RequestBody Todo todo,
			Authentication authentication) {

		String email = authentication.getName();

		Todo updateTodo = todoservice.updateTodos(id, todo, email);

		return ResponseEntity.ok(updateTodo);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteTodoId(@PathVariable Long id, Authentication authentication) {

		String email = authentication.getName();

		todoservice.deleteTodoId(id, email);

		return ResponseEntity.ok("Diary Deleted Successfully!");
	}
}