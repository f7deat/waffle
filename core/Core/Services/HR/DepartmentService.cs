using Waffle.Core.Foundations.Models;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.IServices.HR;
using Waffle.Core.Services.HR.Filters;
using Waffle.Entities.HR;
using Waffle.Models;

namespace Waffle.Core.Services.HR;

public class DepartmentService(IDepartmentRepository _departmentRepository, IBranchRepository _branchRepository) : IDepartmentService
{
    public async Task<TResult> CreateAsync(Department args)
    {
        var branch = await _branchRepository.FindAsync(args.BranchId);
        if (branch is null) return TResult.Failed("Branch not found!");

        await _departmentRepository.AddAsync(new Department
        {
            Name = args.Name,
            BranchId = args.BranchId
        });
        return TResult.Success;
    }

    public async Task<TResult> UpdateAsync(Department args)
    {
        var department = await _departmentRepository.FindAsync(args.Id);
        if (department is null) return TResult.Failed("Department not found!");

        var branch = await _branchRepository.FindAsync(args.BranchId);
        if (branch is null) return TResult.Failed("Branch not found!");

        department.Name = args.Name;
        department.BranchId = args.BranchId;
        await _departmentRepository.UpdateAsync(department);
        return TResult.Success;
    }

    public async Task<TResult> DeleteAsync(int id)
    {
        var department = await _departmentRepository.FindAsync(id);
        if (department is null) return TResult.Failed("Department not found!");

        await _departmentRepository.DeleteAsync(department);
        return TResult.Success;
    }

    public async Task<TResult> GetByIdAsync(int id)
    {
        var department = await _departmentRepository.FindAsync(id);
        if (department is null) return TResult.Failed("Department not found!");
        return TResult.Ok(new
        {
            department.Id,
            department.Name,
            department.BranchId
        });
    }

    public Task<ListResult> GetListAsync(DepartmentFilterOptions filterOptions) => _departmentRepository.GetListAsync(filterOptions);

    public Task<object> GetOptionsAsync(DepartmentSelectOptions selecOptions) => _departmentRepository.GetOptionsAsync(selecOptions);
}
