package com.gruposiete.hotlinemiauami;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class HotlinemiauamiApplication {

	public static void main(String[] args) {
		SpringApplication.run(HotlinemiauamiApplication.class, args);
	}

	@Bean
	public long getThreshold() {
		return 10000;
	}

	@Bean("usersPath")
	public String getDataPath() {
		return "data";
	}

	@Bean
	public UserDAO getUserDAO(String usersPath) {
		return new UserDAO(usersPath);
	}

	@Bean
	public UserService getUserService(UserDAO userDAO, ApiStatusService apiStatusService) {
		return new UserService(userDAO, apiStatusService);
	}
}
