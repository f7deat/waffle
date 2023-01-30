using Microsoft.EntityFrameworkCore;

namespace Waffle.Models
{
    public class ListResult<T> where T : class
    {
        public IEnumerable<T>? Data { get; set; }
        public int Total { get; set; }
        public bool Succeeded { get; }
        private IFilterOptions FilterOptions { get; set; }
        public bool HasNextPage => Total > FilterOptions.Current * FilterOptions.PageSize;
        public bool HasPreviousPage => FilterOptions.Current > 1;

        public ListResult(IEnumerable<T> data, int total, IFilterOptions filterOptions)
        {
            Data = data;
            Succeeded = true;
            Total = total;
            FilterOptions = filterOptions;
        }

        public static async Task<ListResult<T>> Success(IQueryable<T> query, IFilterOptions filterOptions)
        {
            return new ListResult<T>(await query.Skip((filterOptions.Current - 1) * filterOptions.PageSize).Take(filterOptions.PageSize).ToListAsync(), await query.CountAsync(), filterOptions);
        }
    }
}
