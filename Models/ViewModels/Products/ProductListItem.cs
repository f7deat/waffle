﻿using Waffle.Entities;

namespace Waffle.Models.ViewModels.Products;

public class ProductListItem : Catalog
{
    public string Url { get; set; } = default!;
    public decimal? Price { get; set; }
    public decimal? SalePrice { get; set; }
}
