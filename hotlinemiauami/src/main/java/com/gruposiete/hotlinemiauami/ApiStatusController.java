package com.gruposiete.hotlinemiauami;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/status")
public class ApiStatusController {
    
    @Autowired
    private final ApiStatusService apiStatusService;

    @Autowired
    private final long seenThreshold;

    //Cambiar esto para que la logica la haga en un Service
    @Autowired
    private UserDAO userDAO;

    public ApiStatusController(ApiStatusService apiStatusService, long seenThreshold) {
        this.apiStatusService = apiStatusService;
        this.seenThreshold = seenThreshold;
    }

    @GetMapping("/connected-users")
    public ResponseEntity<ConnectedUsersResponse> getConnectedUsers() {
        int numberOfUsersConnected = this.apiStatusService.numberOfUsersConnected(seenThreshold);
        return ResponseEntity.ok(new ConnectedUsersResponse(numberOfUsersConnected));
    }

    record ConnectedUsersResponse(long connectedUsers) {

    }
}
