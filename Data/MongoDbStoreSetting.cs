namespace Waffle.Data
{
    public class MongoDbStoreSetting
    {
        public string ConnectionString { get; set; } = null!;

        public string DatabaseName { get; set; } = null!;

        public string CommentsCollectionName { get; set; } = null!;
    }
}
