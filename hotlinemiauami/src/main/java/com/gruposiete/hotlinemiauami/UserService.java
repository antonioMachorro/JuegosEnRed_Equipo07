package com.gruposiete.hotlinemiauami;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

public class UserService {

    @Autowired
    private final UserDAO userDAO;

    @Autowired
    private final ApiStatusService apiStatusService;

    public UserService(UserDAO userDAO, ApiStatusService apiStatusService) {
        this.userDAO = userDAO;
        this.apiStatusService = apiStatusService;
    }

    public Optional<User> getUser(String username) {
        apiStatusService.hasSeen(username);
        return userDAO.getUser(username);
    }

    public boolean deleteUser(String username) {
        return userDAO.deleteUser(username);
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
}
