package com.algolovers.newsletterconsole.service.utiity;

import com.algolovers.newsletterconsole.data.entity.groups.Group;
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
        context.setVariable("verificationLink", baseUrl + "/verification?email=" + user.getEmailAddress());
        context.setVariable("contactEmail", botEmail);

        String html = templateEngine.process("verification-email.html", context);

        log.info("Built HTML template, Sending verification email to {}", user.getEmailAddress());

        return sendHtmlEmail("[News Letter] Verify your email address", html, user.getEmailAddress());
    }

    public void sendUserCreationSuccessEmail(User user) {
        Context context = new Context();
        context.setVariable("userFullName", user.getDisplayName());
        context.setVariable("email", user.getEmailAddress());

        String html = templateEngine.process("user-creation-success.html", context);

        log.info("Built HTML template, Sending creation success email to {}", user.getEmailAddress());

        sendHtmlEmail("[News Letter] Account Created Successfully", html, user.getEmailAddress());
    }

    public void sendInvitationEmail(User user, String message, String subMessage) {
        Context context = new Context();
        context.setVariable("inviterName", user.getDisplayName());
        context.setVariable("message", message);
        context.setVariable("subMessage", subMessage);
        context.setVariable("invitationLink", baseUrl);

        String html = templateEngine.process("invitation.html", context);

        log.info("Built HTML template, Sending invitation email to {}", user.getEmailAddress());

        sendHtmlEmail("[News Letter] Newsletter Invitation", html, user.getEmailAddress());
    }

    public void invitationAccept(User user, Group group) {
        group.getGroupMembers()
                .forEach(groupMember -> {
                    User currentUser = groupMember.getUser();
                    Context context = new Context();
                    context.setVariable("userFullName", currentUser.getDisplayName());

                    if (user.getEmailAddress().equals(currentUser.getEmailAddress())) {
                        context.setVariable("message", "You have successfully joined " + group.getGroupName() + ", we wish you the best and hope you have fun.");
                    } else {
                        context.setVariable("message", user.getDisplayName() + "has joined your group, " + group.getGroupName() + " successfully. Have fun!");
                    }

                    String html = templateEngine.process("invitation-accept.html", context);

                    log.info("Built HTML template, Sending invitation accept email to {}", currentUser.getEmailAddress());

                    sendHtmlEmail("[News Letter] Newsletter Invitation", html, currentUser.getEmailAddress());
                });
    }

    public void sendFormLink(Group group) {
        group.getGroupMembers()
                .forEach(groupMember -> {
                    User currentUser = groupMember.getUser();
                    Context context = new Context();
                    context.setVariable("userFullName", currentUser.getDisplayName());
                    context.setVariable("formLink", baseUrl + "/form/" + group.getId());

                    String html = templateEngine.process("form-link.html", context);

                    log.info("Built HTML template, Sending invitation accept email to {}", currentUser.getEmailAddress());

                    sendHtmlEmail("[News Letter] Newsletter Invitation", html, currentUser.getEmailAddress());
                });
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
