using System.Text.Json;
using Waffle.Core.Interfaces.IService;
using Waffle.ExternalAPI.Interfaces;
using Waffle.ExternalAPI.Models;

namespace Waffle.ExternalAPI.Services;

public class TelegramService : ITelegramService
{
    private readonly HttpClient _httpClient;
    private readonly IAppSettingService _appService;
    private readonly ILogger<TelegramService> _logger;

    public TelegramService(HttpClient httpClient, IAppSettingService appService, ILogger<TelegramService> logger)
    {
        _httpClient = httpClient;
        _appService = appService;
        _logger = logger;
    }

    public async Task<bool> SendErrorAsync(string message)
    {
        try
        {
            var setting = await _appService.GetAsync<Telegram>(nameof(Telegram));
            if (setting == null)
            {
                _logger.LogWarning("Telegram setting not found!");
                return false;
            }
            return await SendMessageAsync(setting.Token, setting.ChatId, message);
        }
        catch (Exception)
        {
            return false;
        }
    }

    public async Task<bool> SendMessageAsync(string token, string? chatId, string message)
    {
        try
        {
            if (string.IsNullOrEmpty(chatId)) return false;
            var setting = await _appService.GetAsync<Telegram>(nameof(Telegram));
            if (setting == null)
            {
                _logger.LogWarning("Telegram setting not found!");
            }
            var response = await _httpClient.GetStreamAsync($"https://api.telegram.org/bot{token}/sendMessage?chat_id={chatId}&text={message}&parse_mode=HTML&disable_web_page_preview=true");
            var data = await JsonSerializer.DeserializeAsync<TelegramResponse>(response);
            if (data is null || data?.Ok == false)
            {
                _logger.LogError("Telegram send message failed!");
            }
            return data?.Ok ?? false;
        }
        catch (Exception)
        {
            return false;
        }
    }

    public async Task<bool> SendMessageAsync(string message)
    {
        try
        {
            var setting = await _appService.GetAsync<Telegram>(nameof(Telegram));
            if (setting is null)
            {
                _logger.LogWarning("Telegram setting not found!");
                return false;
            }
            return await SendMessageAsync(setting.Token, setting.ChatId, message);
        }
        catch (Exception)
        {
            return false;
        }
    }
}