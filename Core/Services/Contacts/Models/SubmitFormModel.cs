﻿using Waffle.Entities;

namespace Waffle.Core.Services.Contacts.Models;

public class SubmitFormModel : Contact
{
    public Guid WorkId { get; set; }
}
