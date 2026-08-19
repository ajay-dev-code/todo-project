package com.example.todo.Util;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

	@Autowired
	private JwtUtil jwtUtil;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		String authoHeader = request.getHeader("Authorization");

		if (authoHeader != null && authoHeader.startsWith("Bearer ")) {
			String token = authoHeader.substring(7);
			if (jwtUtil.validateJwtToken(token)) {
				String email = jwtUtil.extractEmail(token);
				var autho = new UsernamePasswordAuthenticationToken(email, null, List.of());
				SecurityContextHolder.getContext().setAuthentication(autho);
			}
		}
		filterChain.doFilter(request, response);

	}

}
