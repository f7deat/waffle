﻿using Waffle.Core.Foundations;

namespace Waffle.Models.ViewModels.Products;

public class ProductListItem : PageData
{
    public decimal? Price { get; set; }
    public decimal? SalePrice { get; set; }

    public decimal Discount => 100 - Math.Round((SalePrice / Price ?? 1) * 100);
}
