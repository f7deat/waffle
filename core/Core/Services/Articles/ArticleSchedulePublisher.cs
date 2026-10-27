using Waffle.Core.Interfaces.IService;

namespace Waffle.Core.Services.Articles;

public sealed class ArticleSchedulePublisher(
    IServiceScopeFactory serviceScopeFactory,
    ILogger<ArticleSchedulePublisher> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var timer = new PeriodicTimer(TimeSpan.FromMinutes(1));
        do
        {
            await using var scope = serviceScopeFactory.CreateAsyncScope();
            var articleService = scope.ServiceProvider.GetRequiredService<IArticleService>();
            var publishedCount = await articleService.PublishScheduledArticlesAsync(stoppingToken);
            if (publishedCount > 0)
                logger.LogInformation("Published {ArticleCount} scheduled articles.", publishedCount);
        }
        while (await timer.WaitForNextTickAsync(stoppingToken));
    }
}
