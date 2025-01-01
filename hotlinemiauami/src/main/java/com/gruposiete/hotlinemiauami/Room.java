package com.gruposiete.hotlinemiauami;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Room {
    private String roomId;
    private String roomName;
    private String creatorUsername;
    private String secondUsername;
    private boolean fullRoom;

    @JsonCreator
    public Room(@JsonProperty("roomId") String roomId,
                @JsonProperty("roomName") String roomName,
                @JsonProperty("creatorUsername") String creatorUsername,
                @JsonProperty("secondUsername") String secondUsername,
                @JsonProperty("fullRoom") boolean fullRoom) {
        this.roomId = roomId;
        this.roomName = roomName;
        this.creatorUsername = creatorUsername;
        this.secondUsername = secondUsername;
        this.fullRoom = fullRoom;
    }

    public String getRoomId() {
        return this.roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public String getRoomName() {
        return this.roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public String getCreatorUsername() {
        return this.creatorUsername;
    }

    public void setCreatorUsername(String creatorUsername) {
        this.creatorUsername = creatorUsername;
    }

    public String getSecondUsername() {
        return this.secondUsername;
    }

    public void setSecondUsername(String secondUsername) {
        this.secondUsername = secondUsername;
    }

    public boolean getFullRoom() {
        return this.fullRoom;
    }

    public void setFullRoom(boolean fullRoom) {
        this.fullRoom = fullRoom;
    }

}
