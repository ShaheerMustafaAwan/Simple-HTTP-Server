package com.http.springboot;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class WebController {

    @GetMapping("/")
    public String rootRedirect() {
        return "redirect:/home.html";
    }

    @GetMapping("/home")
    public String homePage() {
        return "redirect:/home.html";
    }

    @GetMapping("/about")
    public String aboutPage() {
        return "redirect:/about.html";
    }

    @GetMapping("/contact")
    public String contactPage() {
        return "redirect:/contact.html";
    }

    @PostMapping("/submit-form")
    public String handleForm(@RequestParam String name, @RequestParam String message) {
        // Redirect to thankyou.html with name and message as URL parameters
        return "redirect:/thankyou.html?name=" + encodeParam(name) + "&message=" + encodeParam(message);
    }

    // Optional: Helper method to URL-encode parameters safely
    private String encodeParam(String param) {
        return java.net.URLEncoder.encode(param, java.nio.charset.StandardCharsets.UTF_8);
    }
}
