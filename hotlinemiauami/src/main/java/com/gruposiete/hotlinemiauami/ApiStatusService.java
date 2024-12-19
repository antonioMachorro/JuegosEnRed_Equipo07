package com.gruposiete.hotlinemiauami;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

@Service
public class ApiStatusService {

    private final ConcurrentHashMap<String, Long> lastSeen;

    public ApiStatusService() {
        this.lastSeen = new ConcurrentHashMap<>();
    }

    public void hasSeen(String username) {
        System.out.println("Updating last seen for user: " + username);
        this.lastSeen.put(username, System.currentTimeMillis());
        System.out.println("Current last seen map: " + lastSeen);
    }

    public void disconnect(String username) {
        this.lastSeen.remove(username);
    }

    //Threshold en milisegundos
    public List<String> isConnected(long threshold) {
        List<String> connected = new ArrayList<>();
        long currentTimeMillis = System.currentTimeMillis();

        for (var entry: this.lastSeen.entrySet()) {
            if(entry.getValue() > (currentTimeMillis - threshold)) {
                connected.add(entry.getKey());
            } else {
                System.out.println("User is inactive.");
            }
        }
        return connected;
    }

    public int numberOfUsersConnected(long threshold) {
        return this.isConnected(threshold).size();
    }

    public List<String> usersConnected(long threshold) {
        return this.isConnected(threshold);
    }
}
