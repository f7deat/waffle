using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Waffle.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class BaseController : Controller
    {
    }
}
