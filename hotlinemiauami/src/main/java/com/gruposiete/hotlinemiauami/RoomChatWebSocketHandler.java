package com.gruposiete.hotlinemiauami;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class RoomChatWebSocketHandler extends TextWebSocketHandler {
    private final Map<String, Set<WebSocketSession>> roomSessions = new ConcurrentHashMap<>();

    private void addSessionToRoom(String roomId, WebSocketSession session) {
        roomSessions.computeIfAbsent(roomId, key -> ConcurrentHashMap.newKeySet())
                    .add(session);
    }

    private void removeSessionFromRoom(String roomId, WebSocketSession session) {
        Set<WebSocketSession> sessions = roomSessions.get(roomId);
        if(sessions != null) {
            sessions.remove(session);
            if(sessions.isEmpty()) {
                roomSessions.remove(roomId);
            }
        }
    }

    private void broadcastToRoom(String roomId, String content) throws IOException {
        Set<WebSocketSession> sessions = roomSessions.get(roomId);
        if(sessions == null) return;

        TextMessage message = new TextMessage(content);
        for(WebSocketSession ws : sessions) {
            if(ws.isOpen()) {
                ws.sendMessage(message);
            }
        }
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception{
        String path = session.getUri().getPath();
        String[] segments = path.split("/");
        String roomId = segments[segments.length - 1];

        session.getAttributes().put("roomId", roomId);

        addSessionToRoom(roomId, session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String roomId = (String) session.getAttributes().get("roomId");
        if(roomId != null) {
            removeSessionFromRoom(roomId, session);
        }
        super.afterConnectionClosed(session, status);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        System.out.println("Message received: " + message.getPayload());
        String roomId = (String) session.getAttributes().get("roomId");
        if(roomId == null) {
            return;
        }
        broadcastToRoom(roomId, message.getPayload());
    }

}
