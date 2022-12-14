using Microsoft.AspNetCore.Mvc;
using Waffle.Data;

namespace Waffle.Controllers
{
    public class ArticleController : Controller
    {
        private readonly ApplicationDbContext _context;
        public ArticleController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}