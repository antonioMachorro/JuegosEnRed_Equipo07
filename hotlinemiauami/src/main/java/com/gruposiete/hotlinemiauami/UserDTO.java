package com.gruposiete.hotlinemiauami;

public class UserDTO {

    private final String username;
    private final long lastSeen;

    public UserDTO(User user) {
        this.username = user.getUsername();
        this.lastSeen = user.getLastSeen();
    }

    public String getUsername() {
        return username;
    }

    public long lastSeen() {
        return lastSeen;
    }
}
