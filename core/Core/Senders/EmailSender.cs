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
}
