using Microsoft.EntityFrameworkCore;
using Waffle.Models.Components;

namespace Waffle.Models;

public class ListResult
{
    public IEnumerable<object> Data { get; set; } = [];
    public int Total { get; set; }
    public bool Succeeded { get; }
    public string? Message { get; private set; }
    private IFilterOptions FilterOptions { get; set; }
    public bool HasNextPage => Total > FilterOptions.Current * FilterOptions.PageSize;
    public bool HasPreviousPage => FilterOptions.Current > 1;
    public bool HasData => Data.Any();

    public ListResult()
    {
        FilterOptions = new BasicFilterOptions();
    }

    public ListResult(IEnumerable<object> data, int total, IFilterOptions filterOptions)
    {
        Data = data;
        Succeeded = true;
        Total = total;
        FilterOptions = filterOptions;
    }

    public static async Task<ListResult> Success(IQueryable<object> query, IFilterOptions filterOptions)
    {
        if (filterOptions.Current < 1) filterOptions.Current = 1;
        return new ListResult(await query.AsNoTracking().Skip((filterOptions.Current - 1) * filterOptions.PageSize).Take(filterOptions.PageSize).ToListAsync(), await query.CountAsync(), filterOptions);
    }

    public static ListResult Success(IEnumerable<object> query, IFilterOptions filterOptions)
    {
        return new ListResult(query, query.Count(), filterOptions);
    }

    public static ListResult Failed() => new();
    public static ListResult Failed(string message) => new() { Message = message };
}

public class ListResult<T> where T : class
{
    public IEnumerable<T> Data { get; set; } = [];
    public int Total { get; set; }
    public bool Succeeded { get; }
    public string? Message { get; private set; }
    private IFilterOptions FilterOptions { get; set; }
    public bool HasNextPage => Total > FilterOptions.Current * FilterOptions.PageSize;
    public bool HasPreviousPage => FilterOptions.Current > 1;
    public bool HasData => Data.Any();

    public Pagination Pagination { get; set; } = new();

    public ListResult()
    {
        FilterOptions = new BasicFilterOptions();
    }

    public ListResult(IEnumerable<T> data, int total, IFilterOptions filterOptions)
    {
        Data = data;
        Succeeded = true;
        Total = total;
        FilterOptions = filterOptions;
        Pagination = new Pagination
        {
            Current = filterOptions.Current,
            PageSize = filterOptions.PageSize,
            Total = total,
        };
    }

    public static async Task<ListResult<T>> Success(IQueryable<T> query, IFilterOptions filterOptions)
    {
        if (filterOptions.Current < 1) filterOptions.Current = 1;
        return new ListResult<T>(await query.AsNoTracking().Skip((filterOptions.Current - 1) * filterOptions.PageSize).Take(filterOptions.PageSize).ToListAsync(), await query.CountAsync(), filterOptions);
    }

    public static ListResult<T> Success(IEnumerable<T> query, IFilterOptions filterOptions)
    {
        return new ListResult<T>(query, query.Count(), filterOptions);
    }

    public static ListResult<T> Failed() => new();
    public static ListResult<T> Failed(string message) => new() { Message = message };
}
