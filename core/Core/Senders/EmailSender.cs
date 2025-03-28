﻿using SendGrid.Helpers.Mail;
using SendGrid;
using Waffle.Core.Interfaces.IService;
using Microsoft.AspNetCore.Identity.UI.Services;
using Waffle.Models.Settings;
using System.Net.Mail;
using System.Net;

namespace Waffle.Core.Senders;

public class EmailSender(ILogger<EmailSender> _logger, ISettingService _appService) : IEmailSender
{
    public async Task SendEmailAsync(string toEmail, string subject, string message) => await Execute(subject, message, toEmail);

    public async Task Execute(string subject, string message, string toEmail)
    {
        var setting = await _appService.GetAsync<EmailSetting>(nameof(EmailSetting));
        if (setting is null) return;
        if (setting.Protocol == EmailProtocol.SendGrid)
        {
            await SendGridAsync(subject, message, toEmail);
            return;
        }
        try
        {
            if (string.IsNullOrEmpty(setting.FromEmail)) return;
            // Create a MailMessage object
            var mail = new MailMessage
            {
                From = new MailAddress(setting.FromEmail)
            };
            mail.To.Add(toEmail);
            mail.Subject = subject;
            mail.Body = message;

            // Create an SMTP client
            var smtp = new SmtpClient(setting.Host, setting.Port)
            {
                Credentials = new NetworkCredential(setting.FromEmail, setting.Password),
                EnableSsl = true // Enable SSL encryption for secure communication
            };

            // Send the email
            await smtp.SendMailAsync(mail);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Failed to send email. Error: {ex.Message}");
        }
    }

    private async Task SendGridAsync(string subject, string message, string toEmail)
    {
        var app = await _appService.GetAsync<ExternalAPI.SendGrids.SendGrid>(nameof(SendGrid));
        if (string.IsNullOrEmpty(app?.ApiKey))
        {
            _logger.LogError("Null SendGridKey");
            return;
        }
        var client = new SendGridClient(app.ApiKey);
        var from_email = new EmailAddress(app.From.Email, app.From.Name);
        var to_email = new EmailAddress(toEmail);
        var msg = MailHelper.CreateSingleEmail(from_email, to_email, subject, string.Empty, message);
        // Disable click tracking.
        // See https://sendgrid.com/docs/User_Guide/Settings/tracking.html
        msg.SetClickTracking(false, false);
        var response = await client.SendEmailAsync(msg);
        if (response.IsSuccessStatusCode)
        {
            _logger.LogInformation("Email to {toEmail} queued successfully!", toEmail);
        }
        else
        {
            _logger.LogError("Failed to send email: {toEmail}", toEmail);
        }
    }
}
