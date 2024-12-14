﻿using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Data;
using Waffle.Entities.Ecommerces;

namespace Waffle.Infrastructure.Repositories;

public class ProductLinkRepository(ApplicationDbContext context) : EfRepository<ProductLink>(context), IProductLinkRepository
{
    public async Task<IEnumerable<ProductLink>> ListByProductIdAsync(Guid productId) => await _context.ProductLinks.Where(x => x.ProductId == productId).AsNoTracking().ToListAsync();
}
