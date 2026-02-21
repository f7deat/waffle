using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Data;
using Waffle.Entities;

namespace Waffle.Infrastructure.Repositories;

public class ContactRepository(ApplicationDbContext context, IHCAService hcaService) : EfRepository<Contact>(context, hcaService), IContactRepository
{
    public async Task<bool> IsExistAsync(string? phoneNumber, string? email)
    {
        if (await _context.Contacts.AnyAsync(x => x.PhoneNumber == phoneNumber)) return true;
        if (await _context.Contacts.AnyAsync(x => x.Email == email)) return true;
        return false;
    }
}
