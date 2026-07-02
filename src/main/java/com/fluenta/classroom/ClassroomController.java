package com.fluenta.classroom;

import lombok.Data;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Controller
public class ClassroomController {

    private final SimpMessagingTemplate messagingTemplate;

    public ClassroomController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/classroom/{roomId}")
    public void sendMessage(@DestinationVariable String roomId, @Payload ChatMessage message) {
        message.setTimestamp(LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm")));
        messagingTemplate.convertAndSend("/topic/classroom/" + roomId, message);
    }

    @Data
    public static class ChatMessage {
        private String sender;
        private String content;
        private String timestamp;
        private String type; // "CHAT" | "JOIN" | "LEAVE"
    }
}
