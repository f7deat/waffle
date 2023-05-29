//using MongoDB.Bson;
//using MongoDB.Bson.Serialization.Attributes;

namespace Waffle.Models
{
    public class Comment
    {
        //[BsonId]
        //[BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        //[BsonElement("name")]
        public string Name { get; set; } = null!;
        //[BsonElement("createdDate")]
        public DateTime CreatedDate { get; set; }
        //[BsonElement("message")]
        public string Message { get; set; } = null!;
    }
}
