package com.gruposiete.hotlinemiauami;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.RequestBody;

public class UserService {

    @Autowired
    private final UserDAO userDAO;

    @Autowired
    private final ApiStatusService apiStatusService;

    @Value("${data.folder:data}")  // Default to "data/" if not specified
    private String dataFolder;

    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(16);

    public UserService(UserDAO userDAO, ApiStatusService apiStatusService) {
        this.userDAO = userDAO;
        this.apiStatusService = apiStatusService;
    }

    public Optional<User> getUser(String username) {
        apiStatusService.hasSeen(username);
        return userDAO.getUser(username);
    }

    private File getUserFile(String username) {
        return new File(dataFolder + "/" + username + ".json");
    }

    public boolean createUser(User user) {
        if(user.getUsername() == null || user.getPassword() == null) {
            throw new IllegalArgumentException("Username and password cannot be null");
        }

        apiStatusService.hasSeen(user.getUsername());
        Optional<User> existingUser = userDAO.getUser(user.getUsername());
        if(existingUser.isPresent()) {
            return false;
        }

        String encryptedPassword = encoder.encode(user.getPassword());
        user.setPassword(encryptedPassword);
        return userDAO.updateUser(user);
    }

    public boolean updatePassword(String username, String newPassword) {
        if(username == null || newPassword == null) {
            throw new IllegalArgumentException("Username and password cannot be null");
        }

        apiStatusService.hasSeen(username);
        Optional<User> optionalUser = userDAO.getUser(username);
        if(optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setPassword(newPassword);
            return userDAO.updateUser(user);
        }

        return false;
    }

    public List<User> getAllUsers() {
        try {
            return userDAO.getAllUsers();
        } catch(Exception e) {
            throw new RuntimeException("Failed to fetch all users", e);
        }
    }

    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userDAO.getUser(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), new ArrayList<>());
    }

    public ResponseEntity<?> login(LoginDTO loginDTO) throws IOException {
        System.out.println(getUserFile(loginDTO.getUsername()));
        File userFile = getUserFile(loginDTO.getUsername());
        if (!userFile.exists()) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
    
        String userData = new String(Files.readAllBytes(Paths.get(userFile.getPath())));
        String encryptedPassword = getPasswordFromJSON(userData);
    
        if (encoder.matches(loginDTO.getPassword(), encryptedPassword)) {
            apiStatusService.hasSeen(loginDTO.getUsername());
    
            // Obtener el volumen del usuario
            int userVolume = getUserVolume(loginDTO.getUsername());
            
            // Responder con el volumen y otros datos
            return new ResponseEntity<>(
                Map.of(
                    "username", loginDTO.getUsername(),
                    "message", "Login Successful",
                    "volume", userVolume
                ),
                HttpStatus.OK
            );
        } else {
            return new ResponseEntity<>("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }
    }
    

    public String getPasswordFromJSON(String userData) {
        int startIndex = userData.indexOf("\"password\":") + 12;
        int endIndex = userData.indexOf("\"", startIndex);
        return userData.substring(startIndex, endIndex);
    }

    public ResponseEntity<?> logout(@RequestBody LogoutDTO logoutDTO) {
        File userFile = new File("data/" + logoutDTO.getUsername() + ".json");
        if(!userFile.exists()) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        apiStatusService.disconnect(logoutDTO.getUsername());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // NUEVO MÉTODO PARA ACTUALIZAR CONTRASEÑA Y VOLUMEN
    public boolean updateUserSettings(String username, String newPassword, int newVolume) {
        if (username == null) {
            throw new IllegalArgumentException("Username cannot be null");
        }

        Optional<User> optionalUser = userDAO.getUser(username);
        if(optionalUser.isEmpty()) {
            return false;
        }

        User user = optionalUser.get();

        // Actualizar la contraseña si se proporciona
        if (newPassword != null && !newPassword.isBlank()) {
            String encryptedPassword = encoder.encode(newPassword);
            user.setPassword(encryptedPassword);
        }

        // Actualizar el volumen si está en un rango válido
        if (newVolume >= 0 && newVolume <= 100) {
            user.setVolume(newVolume);
        }

        return userDAO.updateUser(user);
    }

    public ResponseEntity<?> deleteUser(LoginDTO loginDTO) throws IOException {
        File userFile = new File("data/" + loginDTO.getUsername() + ".json");
        if(!userFile.exists()) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        String userData = new String(Files.readAllBytes(Paths.get(userFile.getPath())));
        String encryptedPassword = getPasswordFromJSON(userData);

        if(encoder.matches(loginDTO.getPassword(), encryptedPassword)) {
            apiStatusService.disconnect(loginDTO.getUsername());
            userDAO.deleteUser(loginDTO.getUsername());
            return new ResponseEntity<>("User deleted", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }
    }

    public int getUserVolume(String username) {
        Optional<User> userOpt = userDAO.getUser(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return user.getVolume();
        } else {
            return -1; // Indicador de que el usuario no existe
        }
    }
}
