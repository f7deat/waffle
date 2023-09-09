using Microsoft.EntityFrameworkCore;
using System.Reflection;
using Waffle.Core.Foundations;
using Waffle.Core.Helpers;
using Waffle.Core.Interfaces;
using Waffle.Entities;

namespace Waffle.Data.ContentGenerators;

public class ComponentGenerator : BaseGenerator
{
    public ComponentGenerator(ApplicationDbContext context) : base(context)
    {

    }

    private static IEnumerable<Component> GetData()
    {
        var classes = Assembly.GetExecutingAssembly().GetTypes().Where(t => t.Namespace == "Waffle.Models.Components" && t.IsClass && typeof(IComponent).IsAssignableFrom(t)).ToList();
        if (!classes.Any()) throw new NullReferenceException();

        foreach (var cls in classes)
        {
            var display = AttributeHelper.GetDisplay(cls);
            if (display is null || string.IsNullOrEmpty(display.ShortName)) continue;
            yield return new Component
            {
                Active = true,
                Name = display.Name ?? cls.Name,
                NormalizedName = cls.Name
            };
        }
    }

    private async Task EnsureComponentsAsync()
    {
        var components = GetData();
        foreach (var component in components)
        {
            if (await _context.Components.AnyAsync(x => x.NormalizedName.Equals(component.NormalizedName)))
            {
                continue;
            }
            await _context.Components.AddAsync(component);
        }
        await _context.SaveChangesAsync();
    }

    public async Task<IComponent> EnsureComponentAsync(IComponent component)
    {
        var components = GetData();
        if (!components.Any(x => x.NormalizedName.Equals(component.NormalizedName))) throw new NullReferenceException();

        var display = AttributeHelper.GetDisplay(typeof(IComponent)) ?? throw new NullReferenceException();
        var data = new Component
        {
            Name = display.Name ?? string.Empty,
            NormalizedName = display.ShortName ?? string.Empty
        };
        await _context.Components.AddAsync(data);
        return data;
    }

    public override async Task RunAsync() => await EnsureComponentsAsync();
}
