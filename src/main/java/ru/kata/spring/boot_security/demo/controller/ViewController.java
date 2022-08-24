package ru.kata.spring.boot_security.demo.controller;


import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;
import ru.kata.spring.boot_security.demo.model.User;

@Controller
public class ViewController {

    @GetMapping("/startPage")
    public String getStartPage() {
        return "startPage";
    }

    @GetMapping("/admin/page")
    public String page(Model model, @AuthenticationPrincipal User user) {
        model.addAttribute("currentUser", user);
        return "adminPage";
    }

    @GetMapping("/user/page")
    public String aboutUser(Model model, @AuthenticationPrincipal User user) {
        model.addAttribute("user", user);
        return "userPage";
    }

}
