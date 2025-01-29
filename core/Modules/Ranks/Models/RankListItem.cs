using Waffle.Entities.Ranks;

namespace Waffle.Modules.Ranks.Models;

public class RankListItem : RankItem
{
    public int Like { get; set; }
    public int DisLike { get; set; }
    public int Rank { get; set; }
}
