﻿namespace Waffle.Models
{
    public class ComponentListItem
    {
        public ComponentListItem()
        {
            Name = string.Empty;
        }
        public Guid Id { get; set; }
        public string Name { get; set; }
    }
}
