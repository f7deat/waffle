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
            if (display is null) continue;
            var filter = display.GetAutoGenerateFilter() ?? false;
            if (filter) continue;
            yield return new Component
            {
                Active = true,
                Name = display.Name ?? cls.Name,
                NormalizedName = display.Prompt ?? cls.Name
            };
        }
    }

    private async Task EnsureComponentsAsync()
    {
        var newComponents = GetData();
        var compoents = await _context.Components.ToListAsync();
        foreach (var component in newComponents)
        {
            if (compoents.Any(x => x.NormalizedName.Equals(component.NormalizedName, StringComparison.OrdinalIgnoreCase))) continue;
            await _context.Components.AddAsync(component);
        }
        await _context.SaveChangesAsync();
    }

    public override async Task RunAsync() => await EnsureComponentsAsync();
}
