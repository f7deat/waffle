﻿using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Data;
using Waffle.Entities;

namespace Waffle.Infrastructure.Repositories;

public class ContactRepository : EfRepository<Contact>, IContactRepository
{
    public ContactRepository(ApplicationDbContext context) : base(context)
    {
    }
}
