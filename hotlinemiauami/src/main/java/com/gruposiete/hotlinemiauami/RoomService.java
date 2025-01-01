package com.gruposiete.hotlinemiauami;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
public class RoomService {

    private final Map<String, Room> rooms = new ConcurrentHashMap<>();

    public Room createRoom(String roomName, String creatorUsername) {
        String roomId = UUID.randomUUID().toString();

        Room newRoom = new Room(roomId, roomName, creatorUsername, null, false);
        rooms.put(roomId, newRoom);
        return newRoom;
    }

    public List<Room> listAvailableRooms() {
        return rooms.values().stream()
                .filter(room -> !room.getFullRoom())
                .collect(Collectors.toList());
    }

    public Room joinRoom(String roomId, String secondUsername) {
        Room room = rooms.get(roomId);
        if(room != null && !room.getFullRoom()) {
            room.setSecondUsername(secondUsername);
            room.setFullRoom(true);
            return room;
        }

        return null;
    }

    public Room getRoom(String roomId) {
        return rooms.get(roomId);
    }

    public Room removeRoom(String roomId) {
        return rooms.remove(roomId);
    }

    public void clearAllRooms() {
        rooms.clear();
    }

    public Room leaveRoom(String roomId, String username) {
        Room room = rooms.get(roomId);
        if(room == null) {
            return null;
        }

        boolean isCreator = (username != null && username.equals(room.getCreatorUsername()));
        boolean isSecond = (username != null && username.equals(room.getSecondUsername()));

        if(!isCreator && !isSecond) {
            return room;
        }

        if(isCreator) {
            if(room.getSecondUsername() != null) {
                String second = room.getSecondUsername();
                room.setSecondUsername(null);
                room.setCreatorUsername(second);
                room.setFullRoom(false);
                
                return room;
            } else {
                rooms.remove(roomId);

                return null;
            }
        }

        if(isSecond) {
            room.setSecondUsername(null);
            room.setFullRoom(false);

            return room;
        }

        return room;
    }

}
