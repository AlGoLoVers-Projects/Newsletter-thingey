package com.algolovers.newsletterconsole.service;

import com.algolovers.newsletterconsole.data.entity.user.User;
import com.algolovers.newsletterconsole.data.model.api.PasswordResetToken;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Base64;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;
    private final SpringTemplateEngine templateEngine;
    private final ObjectMapper objectMapper;

    @Value("${spring.mail.username}")
    private String botEmail;

    @Value("${newsletter.app.url}")
    private String baseUrl;

    public boolean sendTextEmail(String subject, String body, String... recipient) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(recipient);
        message.setSubject(subject);
        message.setText(body);

        try {
            javaMailSender.send(message);
        } catch (MailException e) {
            e.printStackTrace();
            log.error("Error sending email to {}", Arrays.toString(recipient));
            return false;
        }

        log.info("Email sent to {}", Arrays.toString(recipient));

        return true;
    }

    public boolean sendHtmlEmail(String subject, String htmlContent, String... recipient) {
        MimeMessage message = javaMailSender.createMimeMessage();

        try {
            MimeMessageHelper messageHelper = new MimeMessageHelper(message, true);

            messageHelper.setFrom(botEmail);
            messageHelper.setTo(recipient);
            messageHelper.setSubject(subject);

            messageHelper.setText(htmlContent, true);
        } catch (MessagingException e) {
            log.error("Error sending email to {}", Arrays.toString(recipient));
            e.printStackTrace();
            return false;
        }

        try {
            javaMailSender.send(message);
        } catch (MailException e) {
            log.error("Error sending email to {}", Arrays.toString(recipient));
            e.printStackTrace();
            return false;
        }

        log.info("Email sent to {}", Arrays.toString(recipient));

        return true;
    }

    public boolean sendVerificationEmail(User user, Long verificationCode) {
        Context context = new Context();

        context.setVariable("userFullName", user.getDisplayName());
        context.setVariable("verificationCode", verificationCode);
        context.setVariable("verificationLink", baseUrl + "/verify/" + verificationCode);
        context.setVariable("contactEmail", botEmail);

        String html = templateEngine.process("verification-email.html", context);

        log.info("Built HTML template, Sending verification email to {}", user.getEmailAddress());

        return sendHtmlEmail("[News Letter] Verify your email address", html, user.getEmailAddress());
    }

    public boolean sendPasswordResetEmail(User user, Long verificationCode) {
        Context context = new Context();

        try {
            String encodedId = objectMapper.writeValueAsString(new PasswordResetToken(user.getId()));
            String base64Id = Base64.getUrlEncoder().encodeToString(encodedId.getBytes(StandardCharsets.UTF_8));

            context.setVariable("userFullName", user.getDisplayName());
            context.setVariable("resetCode", verificationCode);
            context.setVariable("resetLink", baseUrl + "/resetPassword?data=" + base64Id);
            context.setVariable("contactEmail", botEmail);

            String html = templateEngine.process("password-reset-email.html", context);

            log.info("Built HTML template, Sending password reset email to {}", user.getEmailAddress());

            return sendHtmlEmail("[News Letter] Reset your password", html, user.getEmailAddress());
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return false;
        }
    }

}
