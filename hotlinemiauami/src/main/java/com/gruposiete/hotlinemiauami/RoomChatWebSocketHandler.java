package com.gruposiete.hotlinemiauami;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Component
public class RoomChatWebSocketHandler extends TextWebSocketHandler {
    private final Map<String, Set<WebSocketSession>> roomSessions = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper;
    private final RoomService roomService;

    @Autowired
    public RoomChatWebSocketHandler(RoomService roomService) {
        this.roomService = roomService;
        this.objectMapper = new ObjectMapper();
    }

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
        String payload = message.getPayload();
        JsonNode json = objectMapper.readTree(payload);

        String type = json.get("type").asText();
        switch (type) {
            case "CHAT":
                handleChatMessage(session, json);
                break;
            case "SET_READY":
                handleSetReady(session, json);
                break;
            default:
                break;
        }

    }

    private void handleChatMessage(WebSocketSession session, JsonNode json) throws IOException {
        String roomId = (String) session.getAttributes().get("roomId");
        if(roomId == null) {
            return;
        }

        broadcastToRoom(roomId, json.toString());
    }

    private void handleSetReady(WebSocketSession session, JsonNode json) throws IOException {
        String username = json.get("username").asText();
        boolean isReady = json.get("isReady").asBoolean();

        String roomId = (String) session.getAttributes().get("roomId");
        if(roomId == null) {
            return;
        }

        Room room = roomService.getRoom(roomId);
        if(room == null) {
            return;
        }

        if(username.equals(room.getCreatorUsername())) {
            room.setCreatorReady(isReady);
        } else if(username.equals(room.getSecondUsername())) {
            room.setSecondReady(isReady);
        }

        broadcastRoomUpdate(roomId, room);
    }

    private void broadcastRoomUpdate(String roomId, Room room) throws IOException {
        ObjectNode update = objectMapper.createObjectNode();
        update.put("type", "ROOM_UPDATED");
        update.put("roomId", room.getRoomId());
        update.put("roomName", room.getRoomName());
        update.put("creatorUsername", room.getCreatorUsername());
        update.put("secondUsername", room.getSecondUsername());
        update.put("creatorReady", room.getCreatorReady());
        update.put("secondReady", room.getSecondReady());

        String updateText = update.toString();

        Set<WebSocketSession> sessions = roomSessions.get(roomId);
        if(sessions == null) return;

        for(WebSocketSession ws : sessions) {
            if(ws.isOpen()) {
                ws.sendMessage(new TextMessage(updateText));
            }
        }
    }

}
