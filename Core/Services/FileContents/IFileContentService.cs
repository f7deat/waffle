namespace Waffle.Core.Services.FileContents
{
    public interface IFileContentService
    {
        Task RemoveFromItemAsync(Guid itemId);
    }
}
