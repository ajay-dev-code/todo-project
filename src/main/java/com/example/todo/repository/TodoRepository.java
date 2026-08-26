package com.example.todo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.todo.Entity.Todo;
import com.example.todo.Entity.UserLogin;

public interface TodoRepository extends JpaRepository<Todo, Long> {

    List<Todo> findByUser(UserLogin user);

}