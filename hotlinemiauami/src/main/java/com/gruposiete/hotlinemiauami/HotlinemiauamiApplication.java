package com.gruposiete.hotlinemiauami;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@SpringBootApplication
@EnableWebSocket
public class HotlinemiauamiApplication implements WebSocketConfigurer {

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry.addHandler(echoHandler(), "/echo")
				.setAllowedOrigins("*");
	}

	@Bean
	public WebSocketEchoHandler echoHandler() {
		return new WebSocketEchoHandler();
	}

	public static void main(String[] args) {
		SpringApplication.run(HotlinemiauamiApplication.class, args);
	}

	@Bean
	public WebSecurityCustomizer webSecurityCustomizer() {
		return (web) -> web.ignoring().requestMatchers(
		new AntPathRequestMatcher("/**"));
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

	@Bean
	public ApiStatusController apiStatusController(ApiStatusService apiStatusService) {
		return new ApiStatusController(apiStatusService, getThreshold());
	}
}
