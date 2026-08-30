using Waffle.Core.Foundations.Models;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.IServices.HR;
using Waffle.Core.Services.HR.Filters;
using Waffle.Entities.HR;
using Waffle.Models;

namespace Waffle.Core.Services.HR;

public class BranchService(IBranchRepository _branchRepository) : IBranchService
{
    public async Task<TResult> CreateAsync(Branch args)
    {
        await _branchRepository.AddAsync(new Branch
        {
            Name = args.Name,
            Address = args.Address,
            Phone = args.Phone,
            Email = args.Email
        });
        return TResult.Success;
    }

    public async Task<TResult> UpdateAsync(Branch args)
    {
        var branch = await _branchRepository.FindAsync(args.Id);
        if (branch is null) return TResult.Failed("Branch not found!");

        branch.Name = args.Name;
        branch.Address = args.Address;
        branch.Phone = args.Phone;
        branch.Email = args.Email;
        await _branchRepository.UpdateAsync(branch);
        return TResult.Success;
    }

    public async Task<TResult> DeleteAsync(int id)
    {
        var branch = await _branchRepository.FindAsync(id);
        if (branch is null) return TResult.Failed("Branch not found!");

        await _branchRepository.DeleteAsync(branch);
        return TResult.Success;
    }

    public async Task<TResult> GetByIdAsync(int id)
    {
        var branch = await _branchRepository.FindAsync(id);
        if (branch is null) return TResult.Failed("Branch not found!");
        return TResult.Ok(new
        {
            branch.Id,
            branch.Name,
            branch.Address,
            branch.Phone,
            branch.Email
        });
    }

    public Task<ListResult> GetListAsync(BranchFilterOptions filterOptions) => _branchRepository.GetListAsync(filterOptions);

    public Task<object> GetOptionsAsync(BranchSelectOptions selecOptions) => _branchRepository.GetOptionsAsync(selecOptions);
}
