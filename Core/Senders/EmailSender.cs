﻿using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Options;
using SendGrid.Helpers.Mail;
using SendGrid;
using Waffle.Core.Services.AppSettings;

namespace Waffle.Core.Senders
{
    public class EmailSender : IEmailSender
    {
        private readonly ILogger _logger;
        private readonly IAppSettingService _appService;

        public EmailSender(ILogger<EmailSender> logger, IAppSettingService appService)
        {
            _appService = appService;
            _logger = logger;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string message)
        {
            await Execute(subject, message, toEmail);
        }

        public async Task Execute(string subject, string message, string toEmail)
        {
            var app = await _appService.GetAsync<ExternalAPI.SendGrid.SendGridConfigure>(nameof(SendGrid));
            if (string.IsNullOrEmpty(app?.ApiKey))
            {
                throw new Exception("Null SendGridKey");
            }
            var client = new SendGridClient(app.ApiKey);
            var msg = new SendGridMessage()
            {
                From = new EmailAddress(app.From.Email, app.From.Name),
                Subject = subject,
                PlainTextContent = message,
                HtmlContent = message
            };
            msg.AddTo(new EmailAddress(toEmail));

            // Disable click tracking.
            // See https://sendgrid.com/docs/User_Guide/Settings/tracking.html
            msg.SetClickTracking(false, false);
            var response = await client.SendEmailAsync(msg);
            _logger.LogInformation(response.IsSuccessStatusCode ? $"Email to {toEmail} queued successfully!" : $"Failure Email to {toEmail}");
        }
    }
}