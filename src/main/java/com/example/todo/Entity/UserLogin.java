package com.example.todo.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "userModel")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserLogin {

	@Id
	@GeneratedValue
	private Long id;
	@Email(message = "Email must be valid")
	private String email;
	@NotBlank(message = "Password cannot be blank")
	private String password;
	
	

}
