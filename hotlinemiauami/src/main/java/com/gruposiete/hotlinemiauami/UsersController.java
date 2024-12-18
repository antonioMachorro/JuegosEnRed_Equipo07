package com.gruposiete.hotlinemiauami;

import java.io.IOException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    @Autowired
    private final UserService userService;

    public UsersController(UserService userService) {
        this.userService = userService;
    }

    /**
     * GET /api/users/{username}
     */
    @GetMapping("/{username}")
    public ResponseEntity<UserDTO> getUser(@PathVariable String username) {
        Optional<User> user = userService.getUser(username);
        return user.map(value -> ResponseEntity.ok(new UserDTO(value)))
                   .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * DELETE /api/users/{username}
     */
    @DeleteMapping("/{username}")
    public ResponseEntity<?> deleteUser(@PathVariable String username) {
        boolean deleted = userService.deleteUser(username);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    /**
     * POST /api/users/
     * Crear un nuevo usuario
     */
    @PostMapping("/")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            boolean created = userService.createUser(user);
            return created ? ResponseEntity.noContent().build() : ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch(IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * PUT /api/users/{username}
     * Actualizar contraseña y volumen
     */
    @PutMapping("/{username}")
    public ResponseEntity<?> updateUserSettings(@PathVariable String username,
                                                @RequestBody UserSettingsUpdateRequest request) {
        try {
            boolean updated = userService.updateUserSettings(username, request.password(), request.volume());
            return updated ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * GET /api/users/
     */
    @GetMapping("/")
    public ResponseEntity<?> getAllUsers() {
        try {
            return ResponseEntity.ok(userService.getAllUsers());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    /**
     * POST /api/users/login
     * Login del usuario
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) throws IOException {
        return userService.login(loginDTO);
    }

    /**
     * POST /api/users/logout
     * Logout del usuario
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody LogoutDTO logoutDTO) {
        return userService.logout(logoutDTO);
    }

    // DTO para la actualización de configuración del usuario (contraseña y volumen)
    public record UserSettingsUpdateRequest(String password, int volume) {}
}
