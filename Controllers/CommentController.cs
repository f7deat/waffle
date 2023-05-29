using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
//using MongoDB.Driver;
using Waffle.Data;
using Waffle.Models;

namespace Waffle.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class CommentController : Controller
    {
        //private readonly IMongoCollection<Comment> _commentsCollection;

        public CommentController(IOptions<MongoDbStoreSetting> options)
        {
            //var mongoClient = new MongoClient(options.Value.ConnectionString);

            //var mongoDatabase = mongoClient.GetDatabase(options.Value.DatabaseName);

            //_commentsCollection = mongoDatabase.GetCollection<Comment>(options.Value.CommentsCollectionName);
        }

        [HttpPost("insert-one")]
        public async Task<IActionResult> InsertOneAsync(Comment newComment)
        {
            //await _commentsCollection.InsertOneAsync(newComment);
            return Ok(IdentityResult.Success);
        }

        //public async Task UpdateAsync(string id, Comment updatedComment) =>
        //await _commentsCollection.ReplaceOneAsync(x => x.Id == id, updatedComment);

        //public async Task RemoveAsync(string id) =>
        //    await _commentsCollection.DeleteOneAsync(x => x.Id == id);
    }
}
