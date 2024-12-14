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
        this.lastSeen.put(username, System.currentTimeMillis());
    }

    //Threshold en milisegundos
    public List<String> isConnected(long threshold) {
        List<String> connected = new ArrayList<>();
        long currentTimeMillis = System.currentTimeMillis();

        for (var entry: this.lastSeen.entrySet()) {
            if(entry.getValue() > (currentTimeMillis - threshold)) {
                connected.add(entry.getKey());
            }
        }

        //Otra forma pero toda fea
        //return this.lastSeen.entrySet().stream().filter((entry) -> entry.getValue() > (currentTimeMillis - threshold)).map((entry) -> entry.getValue()).collect(Collectors.toList());

        return connected;
    }

    public int numberOfUsersConnected(long threshold) {
        return this.isConnected(threshold).size();
    }
}
