package com.gruposiete.hotlinemiauami;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class User {

    private String username;
    private String password;
    private int volume;
    private long lastSeen;

    @JsonCreator
public User(@JsonProperty("username") String username, 
            @JsonProperty("password") String password, 
            @JsonProperty("lastSeen") long lastSeen,
            @JsonProperty("volume") int volume) {
    this.username = username;
    this.password = password;
    this.lastSeen = lastSeen;
    this.volume = volume;
}

    public User() {

    }

    public String getUsername() {
        return this.username;
    }

    public String getPassword() {
        return this.password;
    }

    public long getLastSeen() {
        return this.lastSeen;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getVolume() {
        return this.volume;
    }

    public void setVolume(int volume) {
        this.volume = volume;
    }
}
