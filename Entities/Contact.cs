using System.ComponentModel.DataAnnotations;

namespace Waffle.Entities
{
    public class Contact : BaseEntity
    {
        public Contact()
        {
            Name = string.Empty;
            Email = string.Empty;
            PhoneNumber = string.Empty;
            Meta = string.Empty;
            Note = string.Empty;
        }
        [StringLength(450)]
        public string Name { get; set; }
        [StringLength(450)]
        public string Email { get; set; }
        [StringLength(20)]
        public string PhoneNumber { get; set; }
        [StringLength(1000)]
        public string Note { get; set; }
        public string Meta { get; set; }
    }

    public class ContactMeta
    {
        public ContactMeta()
        {
            ErrorMessage = string.Empty;
        }
        public string ErrorMessage { get; set; }
    }
}
