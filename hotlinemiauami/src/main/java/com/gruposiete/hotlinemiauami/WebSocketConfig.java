package com.gruposiete.hotlinemiauami;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final RoomChatWebSocketHandler roomChatWebSocketHandler;

    public WebSocketConfig(RoomChatWebSocketHandler roomChatWebSocketHandler) {
        this.roomChatWebSocketHandler = roomChatWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(roomChatWebSocketHandler, "/ws/room/*")
                .setAllowedOrigins("*");
    }

}