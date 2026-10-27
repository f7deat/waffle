namespace Waffle.Core.Services.Articles.Models;

/// <summary>Article information displayed in the editorial schedule.</summary>
public sealed record ArticleScheduleItemResponse(
    Guid Id,
    string Name,
    DateTimeOffset? PublishedAt,
    DateTimeOffset? ScheduledAt,
    int? CategoryId,
    string? CategoryName,
    Guid CreatorId,
    string? CreatorName,
    string? Thumbnail,
    int ViewCount,
    bool IsReadyToPublish);

/// <summary>A category option available in the schedule filters.</summary>
public sealed record ArticleScheduleCategoryResponse(int Id, string Name);

/// <summary>An author option available in the schedule filters.</summary>
public sealed record ArticleScheduleAuthorResponse(Guid Id, string Name);

/// <summary>Calendar entries, draft options, and filter values for a schedule range.</summary>
public sealed record ArticleScheduleResponse(
    IReadOnlyList<ArticleScheduleItemResponse> Articles,
    IReadOnlyList<ArticleScheduleItemResponse> Drafts,
    IReadOnlyList<ArticleScheduleCategoryResponse> Categories,
    IReadOnlyList<ArticleScheduleAuthorResponse> Authors);

/// <summary>Sets or clears an article's scheduled publication time.</summary>
public sealed record ScheduleArticleRequest
{
    public required DateTimeOffset? ScheduledAt { get; init; }
}

/// <summary>Result of updating an article's publication schedule.</summary>
public sealed record ScheduleArticleResponse(Guid Id, DateTimeOffset? ScheduledAt);
