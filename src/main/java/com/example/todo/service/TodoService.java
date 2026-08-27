package com.example.todo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.todo.Entity.Todo;
import com.example.todo.Entity.UserLogin;
import com.example.todo.repository.TodoRepository;
import com.example.todo.repository.UserLoginRepository;

@Service
public class TodoService {

	@Autowired
	private TodoRepository todorepo;

	@Autowired
	private UserLoginRepository userrepo;

	public Todo createTodos(Todo todo, String email) {

		UserLogin user = userrepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		todo.setUser(user);

		return todorepo.save(todo);
	}

	public List<Todo> getAllTodos(String email) {

		UserLogin user = userrepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		return todorepo.findByUser(user);
	}

	
	public Todo getById(Long id, String email) {

		UserLogin user = userrepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		Todo todo = todorepo.findById(id).orElseThrow(() -> new RuntimeException("My Diary not found"));

		if (!todo.getUser().getId().equals(user.getId())) {
			throw new RuntimeException("You are not allowed to access this Diary");
		}

		return todo;
	}

	public Todo updateTodos(Long id, Todo todo, String email) {

		UserLogin user = userrepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		Todo existing = todorepo.findById(id).orElseThrow(() -> new RuntimeException("My Diary not found"));

		if (!existing.getUser().getId().equals(user.getId())) {
			throw new RuntimeException("You are not allowed to update this Diary");
		}
		
		existing.setTitle(todo.getTitle());
		existing.setContent(todo.getContent());
		existing.setMood(todo.getMood());
		existing.setEntryDate(todo.getEntryDate());
		existing.setCompleted(todo.isCompleted());

		return todorepo.save(existing);
	}

	public void deleteTodoId(Long id, String email) {

		UserLogin user = userrepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		Todo todo = todorepo.findById(id).orElseThrow(() -> new RuntimeException("My Diary not found"));

		if (!todo.getUser().getId().equals(user.getId())) {
			throw new RuntimeException("You are not allowed to delete this Diary");
		}

		todorepo.delete(todo);
	}
}