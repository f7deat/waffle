namespace Waffle.Core.Foundations.Interfaces;

public interface IComponent
{
    Guid Id { get; set; }
    string NormalizedName { get; set; }
}
