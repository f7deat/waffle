using Waffle.Core.Foundations;

namespace Waffle.Models.Args;

public class WorkUpdateArgs : AbstractComponent
{
    public string? Name { get; set; }
    public bool Active { get; set; }
}
