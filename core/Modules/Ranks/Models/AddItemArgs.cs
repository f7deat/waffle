using Waffle.Models.Components;

namespace Waffle.Modules.Ranks.Models;

public class AddItemArgs : RankItem
{
    public Guid WorkId { get; set; }
}
