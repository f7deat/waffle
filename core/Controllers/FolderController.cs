using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Foundations;

namespace Waffle.Controllers;

public class FolderController : BaseController
{
    private readonly IFolderService _folderService;
    public FolderController(IFolderService folderService)
    {
        _folderService = folderService;
    }

}
