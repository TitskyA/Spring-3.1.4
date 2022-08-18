package ru.kata.spring.boot_security.demo.controller;


import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import ru.kata.spring.boot_security.demo.service.UserServiceImpl;
import ru.kata.spring.boot_security.demo.model.User;


@RestController
@RequestMapping("/user")
public class UserController {

    final UserServiceImpl userService;

    public UserController(UserServiceImpl userService) {
        this.userService = userService;
    }

    @GetMapping("/page")
    public ModelAndView aboutUser(ModelAndView modelAndView, @AuthenticationPrincipal User user) {
        modelAndView.addObject("user", user);
        modelAndView.setViewName("userPage");
        return modelAndView;
    }

    @GetMapping("/currentUser")
    public User getCurrentUser(@AuthenticationPrincipal User user) {
        return userService.get(user.getId());
    }

}
