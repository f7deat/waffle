using Waffle.Core.Foundations.Models;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;

namespace Waffle.Core.Services.Contacts;

public class ContactService(IContactRepository _contactRepository) : IContactService
{
    public async Task<TResult> AddAsync(Contact args)
    {
        args.CreatedDate = DateTime.UtcNow;
        await _contactRepository.AddAsync(args);
        return TResult.Success;
    }

    public async Task<TResult> DeleteAsync(Guid id)
    {
        var data = await _contactRepository.FindAsync(id);
        if (data is null) return TResult.Failed("Contact not found!");
        await _contactRepository.DeleteAsync(data);
        return TResult.Success;
    }
}
