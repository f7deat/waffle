using Waffle.Core.Foundations.Models;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.IServices;
using Waffle.Core.Services.Categories.Filters;
using Waffle.Entities.Settings;
using Waffle.Models;

namespace Waffle.Core.Services.Categories;

public class CategoryService(ICategoryRepository categoryRepository) : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository = categoryRepository;

    public async Task<TResult> CreateAsync(Category args, string locale)
    {
        await _categoryRepository.AddAsync(new Category
        {
            Name = args.Name,
            Description = args.Description,
            ParentId = args.ParentId,
            Type = args.Type,
            Locale = locale
        });
        return TResult.Success;
    }

    public async Task<TResult> UpdateAsync(Category args)
    {
        var category = await _categoryRepository.FindAsync(args.Id);
        if (category is null || category.DeletedAt.HasValue) return TResult.Failed("Category not found!");

        category.Name = args.Name;
        category.Description = args.Description;
        category.ParentId = args.ParentId;
        category.Type = args.Type;
        category.Locale = string.IsNullOrWhiteSpace(args.Locale) ? category.Locale : args.Locale;

        await _categoryRepository.UpdateAsync(category);
        return TResult.Success;
    }

    public async Task<TResult> DeleteAsync(int id)
    {
        var category = await _categoryRepository.FindAsync(id);
        if (category is null || category.DeletedAt.HasValue) return TResult.Failed("Category not found!");

        category.DeletedAt = DateTime.UtcNow;
        await _categoryRepository.UpdateAsync(category);
        return TResult.Success;
    }

    public async Task<TResult> GetByIdAsync(int id)
    {
        var category = await _categoryRepository.FindAsync(id);
        if (category is null || category.DeletedAt.HasValue) return TResult.Failed("Category not found!");

        return TResult.Ok(new
        {
            category.Id,
            category.Name,
            category.Description,
            category.ParentId,
            category.Type,
            category.Locale
        });
    }

    public Task<ListResult> GetListAsync(CategoryFilterOptions filterOptions) => _categoryRepository.GetListAsync(filterOptions);

    public Task<IEnumerable<object>> GetOptionsAsync(CategoryOptionFilterOptions filterOptions) => _categoryRepository.GetOptionsAsync(filterOptions);
}
