using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Waffle.Entities;

public interface IBaseEntity
{
    Guid Id { get; set; }
}

public interface IBaseEntity<T>
{
    T Id { get; set; }
}

public interface ISoftDelete
{
    bool IsDeleted { get; set; }
}

public class BaseEntity : IBaseEntity
{
    [Key]
    [JsonPropertyName("id")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; } = default!;
}

public class BaseEntity<T> : IBaseEntity<T>
{
    [Key]
    [JsonPropertyName("id")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public T Id { get; set; } = default!;
}

public interface IAuditEntity : IBaseEntity
{
    Guid CreatedBy { get; set; }
    DateTime CreatedDate { get; set; }
    Guid? ModifiedBy { get; set; }
    DateTime? ModifiedDate { get; set; }
}

public interface IAuditEntity<T> : IBaseEntity<T>
{
    Guid CreatedBy { get; set; }
    DateTime CreatedDate { get; set; }
    Guid? ModifiedBy { get; set; }
    DateTime? ModifiedDate { get; set; }
}

public class AuditEntity : BaseEntity, IAuditEntity
{
    [JsonPropertyName("createdBy")]
    public Guid CreatedBy { get; set; } = default!;
    [JsonPropertyName("createdDate")]
    public DateTime CreatedDate { get; set; }
    [JsonPropertyName("modifiedBy")]
    public Guid? ModifiedBy { get; set; }
    [JsonPropertyName("modifiedDate")]
    public DateTime? ModifiedDate { get; set; }
}

public class AuditEntity<T> : BaseEntity<T>, IAuditEntity<T>
{
    [JsonPropertyName("createdBy")]
    public Guid CreatedBy { get; set; } = default!;
    [JsonPropertyName("createdDate")]
    public DateTime CreatedDate { get; set; }
    [JsonPropertyName("modifiedBy")]
    public Guid? ModifiedBy { get; set; }
    [JsonPropertyName("modifiedDate")]
    public DateTime? ModifiedDate { get; set; }
}