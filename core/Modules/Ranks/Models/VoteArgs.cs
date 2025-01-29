namespace Waffle.Modules.Ranks.Models;

public class VoteArgs
{
    public Guid CatalogId { get; set; }
    public Guid WorkId { get; set; }
    public Guid RankId { get; set; }
}
