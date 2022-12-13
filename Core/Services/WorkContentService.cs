﻿using Microsoft.AspNetCore.Identity;
using Waffle.Core.Interfaces.IServices;
using Waffle.Data;

namespace Waffle.Core.Services
{
    public class WorkContentService : IWorkContentService
    {
        private readonly ApplicationDbContext _context;
        public WorkContentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IdentityResult> DeleteAsync(Guid id)
        {
            var workContent = await _context.WorkContents.FindAsync(id);
            if (workContent == null)
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Description = "Content not found!"
                });
            }
            _context.WorkContents.Remove(workContent);
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }
    }
}
