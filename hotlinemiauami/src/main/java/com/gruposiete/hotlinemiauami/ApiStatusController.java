package com.gruposiete.hotlinemiauami;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/api/status")
public class ApiStatusController {
    
    private final ApiStatusService apiStatusService;
    private final long seenThreshold;

    public ApiStatusController(ApiStatusService apiStatusService, long seenThreshold) {
        this.apiStatusService = apiStatusService;
        this.seenThreshold = seenThreshold;
    }

    @GetMapping("/connection")
    public ResponseEntity<String> getServerConnection() {
        return ResponseEntity.ok("Connected to server."); 
    }
    

    @GetMapping("/connected-users")
    public ResponseEntity<ConnectedUsersResponse> getConnectedUserNumber() {
        int numberOfUsersConnected = this.apiStatusService.numberOfUsersConnected(seenThreshold);
        return ResponseEntity.ok(new ConnectedUsersResponse(numberOfUsersConnected));
    }

    @GetMapping("/users")
    public ResponseEntity<ConnectedUsers> getConnectedUsers() {
        System.out.println("Current threshold: " + seenThreshold);
        List<String> usersConnected = this.apiStatusService.usersConnected(seenThreshold);
        return ResponseEntity.ok(new ConnectedUsers(usersConnected));
    }
    

    record ConnectedUsersResponse(long connectedUsers) {

    }

    record ConnectedUsers(List<String> connectedUsers) {

    }
}
