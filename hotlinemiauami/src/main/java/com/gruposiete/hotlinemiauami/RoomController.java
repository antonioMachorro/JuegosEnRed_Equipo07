package com.gruposiete.hotlinemiauami;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@RequestMapping("/rooms")
public class RoomController {
    
    @Autowired
    private RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping("/create")
    public ResponseEntity<Room> createRoom(@RequestBody RoomCreationRequest roomCreationRequest) {
        if(roomCreationRequest.roomName == null || roomCreationRequest.roomName.isEmpty() || 
        roomCreationRequest.creatorUsername == null || roomCreationRequest.creatorUsername.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return new ResponseEntity<>(roomService.createRoom(roomCreationRequest.roomName, roomCreationRequest.creatorUsername), HttpStatus.CREATED);
    }

    @GetMapping("/available")
    public ResponseEntity<List<Room>> getAvailableRooms() {
        List<Room> rooms = roomService.listAvailableRooms();
        if(rooms.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return ResponseEntity.ok(rooms);
    }

    @PostMapping("/{roomId}/join")
    public ResponseEntity<Room> joinRoom(@PathVariable String roomId, @RequestBody JoinRequest joinRequest) {
        Room joinedRoom = roomService.joinRoom(roomId, joinRequest.secondUsername);
        if(joinedRoom == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(joinedRoom);
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<Room> getRoom(@PathVariable String roomId) {
        Room room = roomService.getRoom(roomId);
        if(room == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(room);
    }

    @DeleteMapping("/{roomId}")
    public ResponseEntity<?> removeRoom(@PathVariable String roomId) {
        Room room = roomService.removeRoom(roomId);
        if(room == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    @PostMapping("/{roomId}/leave")
    public ResponseEntity<Room> leaveRoom(@PathVariable String roomId, @RequestBody LeaveRequest leaveRequest) {
        Room room = roomService.leaveRoom(roomId, leaveRequest.username);
        if(room == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(room);
    }
    
    public record RoomCreationRequest(String roomName, String creatorUsername){
    }

    public record JoinRequest(String secondUsername) {
    }

    public record LeaveRequest(String username) {
    }

}
