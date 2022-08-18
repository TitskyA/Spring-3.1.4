package ru.kata.spring.boot_security.demo.controller;


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
    public List<User> showAllUsers() {
        return userService.listUsers();
    }

    @GetMapping("/getUser/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.get(id);
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

    @GetMapping("/page")
    public ModelAndView page(ModelAndView modelAndView, @AuthenticationPrincipal User user) {
        modelAndView.addObject("currentUser", user);
        modelAndView.setViewName("adminPage");
        return modelAndView;
    }



}
