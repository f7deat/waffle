namespace Waffle.Entities
{
    public class Order : BaseEntity
    {
        public string? UserId { get; set; }
        public DateTime CreatedDate { get; set; }
        public OrderStatus Status { get; set; }
    }

    public enum OrderStatus
    {
        Open,
        Confirmed,
        Completed,
        Cancelled
    }
}
