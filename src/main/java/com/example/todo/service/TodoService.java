package com.example.todo.service;



import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.todo.Entity.Todo;
import com.example.todo.repository.TodoRepository;

@Service
public class TodoService {

	@Autowired
	private TodoRepository todorepo;

	public Todo createTodos(Todo todo) {
		return todorepo.save(todo);
	}

	public List<Todo> getAllTodos() {
		return todorepo.findAll();
	}

	public Todo getById(Long id) {
		return todorepo.findById(id).orElseThrow(() -> new RuntimeException("Todo not found" + id));
	}

	public Todo updateTodos(Long id, Todo todo) {
	    Todo existing = todorepo.findById(id)
	        .orElseThrow(() -> new RuntimeException("Todo not found"));

	    existing.setTitle(todo.getTitle());
	    existing.setCompleted(todo.isCompleted());

	    return todorepo.save(existing);
	}

	public void deleteTodoId(Long id) {
		todorepo.deleteById(id);
	}

}
