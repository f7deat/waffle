using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Data;
using Waffle.Entities.Ecommerces;
using Waffle.Models.ViewModels.Orders;

namespace Waffle.Infrastructure.Repositories;

public class OrderDetailRepository : EfRepository<OrderDetail>, IOrderDetailRepository
{
    public OrderDetailRepository(ApplicationDbContext context, IHCAService hcaService) : base(context, hcaService)
    {
    }

    public async IAsyncEnumerable<OrderProductItem> ListByOrderAsync(Guid orderId)
    {
        var orderDetails = await _context.OrderDetails.Where(x => x.OrderId == orderId).ToListAsync();
        var variantIds = orderDetails
            .Where(x => x.ProductVariantId.HasValue)
            .Select(x => x.ProductVariantId!.Value)
            .Distinct()
            .ToList();
        var variants = await _context.ProductVariants
            .Where(x => variantIds.Contains(x.Id))
            .ToDictionaryAsync(x => x.Id, x => x.Name);

        foreach (var item in orderDetails)
        {
            var product = await _context.Catalogs.FirstOrDefaultAsync(x => x.Id == item.ProductId);
            if (product is null) continue;
            var variantName = item.ProductVariantId.HasValue
                && variants.TryGetValue(item.ProductVariantId.Value, out var name)
                    ? name
                    : null;
            yield return new OrderProductItem
            {
                Id = item.Id,
                ProductId = item.ProductId,
                ProductVariantId = item.ProductVariantId,
                OrderId = item.OrderId,
                Price = item.Price,
                Quantity = item.Quantity,
                ProductName = product.Name,
                VariantName = variantName
            };
        }
    }
}
