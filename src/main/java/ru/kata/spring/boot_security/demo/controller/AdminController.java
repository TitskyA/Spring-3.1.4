package ru.kata.spring.boot_security.demo.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.RoleServiceImpl;
import ru.kata.spring.boot_security.demo.service.UserService;
import ru.kata.spring.boot_security.demo.service.UserServiceImpl;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/admin")
public class AdminController {

    final PasswordEncoder passwordEncoder;
    final UserService userService;
    final RoleService roleService;

    public AdminController(UserServiceImpl userService, RoleServiceImpl roleService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.roleService = roleService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/allUsers")
    public ResponseEntity<List<User>> showAllUsers() {
        return ResponseEntity.ok().body(userService.listUsers());
    }

    @GetMapping("/getUser/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return ResponseEntity.ok().body(userService.get(id));
    }

    @PostMapping("/saveUser")
    public void addUser(@RequestBody User user) {
        user.getRoles().stream().filter(x -> roleService.findByRoleName(x.getName()) == null).forEach(x -> roleService.add(x));
        user.setRoles(user.getRoles().stream().map(x -> roleService.findByRoleName(x.getName())).collect(Collectors.toList()));
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userService.saveUser(user);
    }

    @PatchMapping ("/update")
    public void saveChanges(@RequestBody User user) {
        user.getRoles().stream().filter(x -> roleService.findByRoleName(x.getName()) == null).forEach(x -> roleService.add(x));
        user.setRoles(user.getRoles().stream().map(x -> roleService.findByRoleName(x.getName())).collect(Collectors.toList()));
        if (!user.getPassword().equals(userService.get(user.getId()).getPassword())) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        userService.update(user);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteUser(@PathVariable("id") Long id) {
        userService.delete(id);
    }



}
