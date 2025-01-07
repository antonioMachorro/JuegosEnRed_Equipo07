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
            case "LOCAL_PLAYER_UPDATE":
                handleLocalPlayerUpdate(session, json);
                break;
            case "SPAWN_ITEM":
                handleItemSpawn(session, json);
                break;
            case "SCENE_READY":
                handleSceneReady(session, json);
                break;
            case "COLLECT_ITEM":
                handleCollectItem(session, json);
                break;
            case "ITEM_USED":
                handleUseItem(session, json);
                break;
            case "TRAMPILLA_USED":
                handleTrampilla(session, json);
                break;
            case "DOOR_USED":
                handleDoor(session, json);
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

    public void handleLocalPlayerUpdate(WebSocketSession session, JsonNode json) throws IOException {
        String roomId = (String) session.getAttributes().get("roomId");
        if(roomId == null) {
            return;
        }

        boolean isPolice = json.get("isPolice").asBoolean();
        double x = json.get("x").asDouble();
        double y = json.get("y").asDouble();
        boolean facingRight = json.get("facingRight").asBoolean();
        String animKey = json.get("animKey").asText();

        ObjectNode update = objectMapper.createObjectNode();
        update.put("type", "OTHER_PLAYER_UPDATE");
        update.put("isPolice", isPolice);
        update.put("x", x);
        update.put("y", y);
        update.put("facingRight", facingRight);
        update.put("animKey", animKey);

        Set<WebSocketSession> sessions = roomSessions.get(roomId);
        if(sessions == null) return;

        TextMessage msg = new TextMessage(update.toString());
        for(WebSocketSession ws : sessions) {
            if(ws.isOpen() && ws != session) {
                ws.sendMessage(msg);
            }
        }
    }

    public void handleItemSpawn(WebSocketSession session, JsonNode json) throws IOException{
        String roomId = (String) session.getAttributes().get("roomId");
        if(roomId == null) {
            return;
        }

        double x = json.get("x").asDouble();
        double y = json.get("y").asDouble();

        ObjectNode spawn = objectMapper.createObjectNode();
        spawn.put("type", "SPAWN_ITEM");
        spawn.put("x", x);
        spawn.put("y", y);

        Set<WebSocketSession> sessions = roomSessions.get(roomId);
        if(sessions == null) return;

        TextMessage msg = new TextMessage(spawn.toString());
        for(WebSocketSession ws : sessions) {
            if(ws.isOpen() && ws != session) {
                ws.sendMessage(msg);
            }
        }
    }

    public void handleSceneReady(WebSocketSession session, JsonNode json) throws IOException{
        String roomId = (String) session.getAttributes().get("roomId");
        if(roomId == null) {
            return;
        }

        ObjectNode ready = objectMapper.createObjectNode();
        ready.put("type", "SCENE_READY");

        Set<WebSocketSession> sessions = roomSessions.get(roomId);
        if(sessions == null) return;

        TextMessage msg = new TextMessage(ready.toString());
        for(WebSocketSession ws : sessions) {
            if(ws.isOpen() && ws != session) {
                ws.sendMessage(msg);
            }
        }
    }

    public void handleCollectItem(WebSocketSession session, JsonNode json) throws IOException{
        String roomId = (String) session.getAttributes().get("roomId");
        if(roomId == null) {
            return;
        }

        String itemType = json.get("item").asText();

        ObjectNode item = objectMapper.createObjectNode();
        item.put("type", "COLLECT_ITEM");
        item.put("item", itemType);

        Set<WebSocketSession> sessions = roomSessions.get(roomId);
        if(sessions == null) return;

        TextMessage msg = new TextMessage(item.toString());
        for(WebSocketSession ws : sessions) {
            if(ws.isOpen() && ws != session) {
                ws.sendMessage(msg);
            }
        }
    }

    public void handleUseItem(WebSocketSession session, JsonNode json) throws IOException{
        String roomId = (String) session.getAttributes().get("roomId");
        if(roomId == null) {
            return;
        }

        ObjectNode item = objectMapper.createObjectNode();
        item.put("type", "ITEM_USED");

        Set<WebSocketSession> sessions = roomSessions.get(roomId);
        if(sessions == null) return;

        TextMessage msg = new TextMessage(item.toString());
        for(WebSocketSession ws : sessions) {
            if(ws.isOpen() && ws != session) {
                ws.sendMessage(msg);
            }
        }
    }

    public void handleTrampilla(WebSocketSession session, JsonNode json) throws IOException{
        String roomId = (String) session.getAttributes().get("roomId");
        if(roomId == null) {
            return;
        }

        int trampillaId = json.get("trampillaId").asInt();

        ObjectNode trampilla = objectMapper.createObjectNode();
        trampilla.put("type", "TRAMPILLA_USED");
        trampilla.put("trampillaId", trampillaId);

        Set<WebSocketSession> sessions = roomSessions.get(roomId);
        if(sessions == null) return;

        TextMessage msg = new TextMessage(trampilla.toString());
        for(WebSocketSession ws : sessions) {
            if(ws.isOpen() && ws != session) {
                ws.sendMessage(msg);
            }
        }
    }

    public void handleDoor(WebSocketSession session, JsonNode json) throws IOException{
        String roomId = (String) session.getAttributes().get("roomId");
        if(roomId == null) {
            return;
        }

        String door = json.get("door").asText();
        String action = json.get("action").asText();

        ObjectNode doorMsg = objectMapper.createObjectNode();
        doorMsg.put("type", "DOOR_USED");
        doorMsg.put("door", door);
        doorMsg.put("action", action);

        Set<WebSocketSession> sessions = roomSessions.get(roomId);
        if(sessions == null) return;

        TextMessage msg = new TextMessage(doorMsg.toString());
        for(WebSocketSession ws : sessions) {
            if(ws.isOpen() && ws != session) {
                ws.sendMessage(msg);
            }
        }
    }

    public void broadcastRoomUpdate(String roomId, Room room) throws IOException {
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
