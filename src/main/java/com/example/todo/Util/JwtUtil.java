package com.example.todo.Util;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

	private final String SECRET = "mysecretkeymysecretkeymysecretkey123";
	private final long EXPIRATION = 1000 * 60 * 60;
	private final Key secretkey = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

	@SuppressWarnings("deprecation")
	public String genrateToken(String email) {
		return Jwts.builder()
				.setSubject(email)
				.setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
				.signWith(secretkey, SignatureAlgorithm.HS256)
				.compact();
	}

	@SuppressWarnings("deprecation")
	public String extractEmail(String token) {
		return Jwts.parser()
				.setSigningKey(secretkey)
				.build()
				.parseClaimsJws(token)
				.getBody()
				.getSubject();

	}

	public boolean validateJwtToken(String token) {
		try {
			extractEmail(token);
			return true; 
		} catch (JwtException exception) {
			return false;
		}
	}
}
