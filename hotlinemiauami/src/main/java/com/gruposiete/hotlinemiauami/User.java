package com.gruposiete.hotlinemiauami;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class User {

    private String username;
    private String password;
    private long lastSeen;

    @JsonCreator
    public User(@JsonProperty("username") String username, 
                @JsonProperty("password") String password, 
                @JsonProperty("lastSeen") long lastSeen) {
        this.username = username;
        this.password = password;
        this.lastSeen = lastSeen;
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
}
