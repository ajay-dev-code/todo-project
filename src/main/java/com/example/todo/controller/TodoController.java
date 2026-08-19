package com.example.todo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
@RequestMapping("/api/todos")

public class TodoController {
	@Autowired
	private TodoService todoservice;

	@PostMapping
	public ResponseEntity<Todo> createuser(@Valid @RequestBody Todo todo) {
		System.out.println("TITLE: " + todo.getTitle());
	    System.out.println("STATUS: " + todo.isCompleted());
		Todo createTodo = todoservice.createTodos(todo);
		return new ResponseEntity<Todo>(createTodo, HttpStatus.CREATED);
	}

	@GetMapping
	public ResponseEntity<List<Todo>> getAllTodo() {
		List<Todo> todo = todoservice.getAllTodos();
		return ResponseEntity.ok(todo);
	}

	@GetMapping("{id}")
	public ResponseEntity<Todo> getByTodoId(@PathVariable Long id) {

		Todo todo = todoservice.getById(id);
		return ResponseEntity.ok(todo);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Todo> updateTodos(@PathVariable Long id, @RequestBody Todo todo) {

		Todo updateTodo = todoservice.updateTodos(id, todo);
		return ResponseEntity.ok(updateTodo);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteTodoId(@PathVariable Long id) {
		System.out.println("DELETE CALLED ID: " + id);
		todoservice.deleteTodoId(id);
		return ResponseEntity.ok("Todo Deleted Successfully !" );
	}

}
