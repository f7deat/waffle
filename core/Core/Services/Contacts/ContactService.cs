using Waffle.Core.Foundations.Models;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Constants;
using Waffle.Core.IServices.Users;
using Waffle.Core.Services.Users.Args;
using Waffle.Entities;

namespace Waffle.Core.Services.Contacts;

public class ContactService(IContactRepository _contactRepository, ILogService _logService, INotificationService _notificationService) : IContactService
{
    public async Task<TResult> AddAsync(Contact args)
    {
        try
        {
            if (await _contactRepository.IsExistAsync(args.PhoneNumber, args.Email)) return TResult.DuplicateRecord;
            args.CreatedDate = DateTime.Now;
            await _contactRepository.AddAsync(args);
            await _notificationService.CreateAsync(new CreateNotificationArgs
            {
                Title = $"Liên hệ mới {args.Name} - {args.PhoneNumber}",
                Content = $"Họ và tên: {args.Name}\nSố điện thoại: {args.PhoneNumber}\nEmail: {args.Email}\nNội dung: {args.Note}",
                ActionUrl = "/user/contact",
                RoleName = RoleName.Admin
            });
            return TResult.Success;
        }
        catch (Exception ex)
        {
            await _logService.ExceptionAsync(ex);
            return TResult.Failed(ex.ToString());
        }
    }

    public async Task<TResult> DeleteAsync(Guid id)
    {
        var data = await _contactRepository.FindAsync(id);
        if (data is null) return TResult.Failed("Contact not found!");
        await _contactRepository.DeleteAsync(data);
        return TResult.Success;
    }
}
