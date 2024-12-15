package com.gruposiete.hotlinemiauami;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.couchbase.CouchbaseProperties.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/users")
public class UsersController {

    //Change this so the logic is done in the userService
    @Autowired
    private final UserService userService;

    public UsersController(UserService userService) {
        this.userService = userService;
    }

    /**
     * GET /api/users/{username}
     * @param param
     * @return
     */
    @GetMapping("/{username}")
    public ResponseEntity<UserDTO> getUser(@PathVariable String username) {
        Optional<User> user = userService.getUser(username);
        return user.map(value -> ResponseEntity.ok(new UserDTO(value)))
                    .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * DELETE /api/users/{username}
     * @param param
     * @return
     */
    @DeleteMapping("/{username}")
    public ResponseEntity<?> deleteUser(@PathVariable String username) {
        boolean deleted = userService.deleteUser(username);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    /**
     * GET /api/users/
     * @param param
     * @return
     */
    @PostMapping("/")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        //Para debuggeo
        //System.out.println(user);

        try {
            boolean created = userService.createUser(user);
            return created ? ResponseEntity.noContent().build() : ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch(IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * PUT /api/users/{username}/password
     * @param param
     * @return
     */
    @PutMapping("/{username}/password")
    public ResponseEntity<?> updatePassword(@PathVariable String username, @RequestBody PasswordUpdateRequest password) {
        try {
            boolean updated = userService.updatePassword(username, password.password());
            return updated ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/")
    public ResponseEntity<?> getAllUsers() {
        try {
            return ResponseEntity.ok(userService.getAllUsers());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public record PasswordUpdateRequest(String password) {
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginDTO loginDTO) throws IOException {
        return userService.login(loginDTO);
    }
}
