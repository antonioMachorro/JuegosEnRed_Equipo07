package com.gruposiete.hotlinemiauami;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.locks.ReentrantReadWriteLock;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/api/chat")
public class ChatController {
    private final List<ChatMessage> messages = new ArrayList<>();
    private ReentrantReadWriteLock lock = new ReentrantReadWriteLock();
    private final AtomicLong messageIdGenerator = new AtomicLong(1);

    @PostMapping
    public ResponseEntity<String> postMessage(@RequestBody ChatRequest request) {
        if(request.message() == null || request.user() == null || request.message().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Message and user are required.");
        }
        
        var writeLock = lock.writeLock();
        writeLock.lock();

        //synchronized(messages)
        try {
            ChatMessage message = new ChatMessage(
                messageIdGenerator.getAndIncrement(), //Evita bugs de adicion al hacerlo concurrentemente
                request.user(),
                request.message(),
                LocalDateTime.now());
            messages.add(message);
        } finally {
            writeLock.unlock();
        }
        return ResponseEntity.ok("Message posted successfully.");
    }

    @GetMapping
    public ResponseEntity<List<ChatMessage>> getMessage(@RequestParam(value = "since", defaultValue = "0") long sinceId) {

        var readLock = this.lock.readLock();
        readLock.lock();
    
        try{
            List<ChatMessage> filteredMessages = messages.stream()
                .filter(message -> message.id() > sinceId)
                .collect(Collectors.toList());
                return ResponseEntity.ok(filteredMessages);
        } finally {
            readLock.unlock();
        }
    }
    
    public record ChatRequest(String user, String message){
    }
    
    public record ChatMessage(long id, String user, String message, LocalDateTime timestamp){
    }
}
