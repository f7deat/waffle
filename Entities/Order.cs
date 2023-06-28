namespace Waffle.Entities
{
    public class Order : BaseEntity
    {
        public Guid UserId { get; set; }
        public DateTime CreatedDate { get; set; }
        public OrderStatus Status { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }

    public enum OrderStatus
    {
        Open,
        Confirmed,
        Paid,
        Refunded,
        Cancelled
    }
}
