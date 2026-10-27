namespace Waffle.Core.Services.Articles;

public sealed class ArticleAlreadyPublishedException()
    : InvalidOperationException("Published articles cannot be scheduled again")
{
}

public sealed class InvalidArticleScheduleException()
    : ArgumentException("Scheduled time must be in the future.", "scheduledAt")
{
}
