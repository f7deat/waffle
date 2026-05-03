# Waffle Project Architecture Patterns

## 1. Service Interface and Implementation Patterns

### Service Interface Structure
Services in the Waffle project follow a layered architecture with clear separation between interface and implementation.

**Location:** `core/Core/Interfaces/IService/` and `core/Core/Services/`

**Example - IArticleService Interface:**
```csharp
public interface IArticleService
{
    Task<TResult> GetByNameAsync(string normalizedName);
    Task<TResult> GetRandomsAsync(string locale);
    Task<TResult> GetStatisticsAsync(string locale);
    Task<ListResult> ListAsync(ArticleFilterOptions filterOptions);
}
```

**Implementation Pattern:**
```csharp
public class ArticleService(IArticleRepository _articleRepository) : IArticleService
{
    public Task<TResult> GetByNameAsync(string normalizedName) => 
        _articleRepository.GetByNameAsync(normalizedName);
    
    public async Task<TResult> GetStatisticsAsync(string locale)
    {
        return TResult.Ok(new
        {
            ViewCount = await _articleRepository.GetTotalViewCountAsync(locale),
            TotalArticles = await _articleRepository.GetTotalArticlesAsync(locale),
            PreviousMonth = await _articleRepository.GetPreviousMonthAsync(locale),
            CurrentMonth = await _articleRepository.GetCurrentMonthAsync(locale)
        });
    }
}
```

### Key Service Pattern Characteristics:
- **Constructor Dependency Injection:** Services receive repository dependencies via constructor
- **Async/Await:** All operations are async using `Task<T>` and `Task` return types
- **Return Types:** 
  - `TResult` - for single operations (success/failure with optional data)
  - `TResult<T>` - typed result for specific operations
  - `ListResult<T>` - for paginated list operations
- **Delegation:** Services often delegate to repositories for data access
- **Business Logic:** Services handle validation, normalization, and orchestration

### CRUD Method Naming Conventions:
- **Create:** `AddAsync(T entity)`, `AddRangeAsync(IReadOnlyList<T> entities)`
- **Read:** `GetAsync()`, `GetByNameAsync()`, `FindAsync()`, `ListAsync()`
- **Update:** `UpdateAsync(T entity)`, `SaveAsync()`
- **Delete:** `DeleteAsync(Guid id)`, `DeleteAsync(T entity)`, `DeleteRangeAsync()`
- **Status:** `ActiveAsync(Guid id)` - toggles Active status

## 2. Repository Pattern

### Base Repository Interface (IAsyncRepository<T>)

**Location:** `core/Core/Foundations/Interfaces/IAsyncRepository.cs`

```csharp
public interface IAsyncRepository<T> where T : class
{
    Task<T?> FindAsync(object id);
    Task<IReadOnlyList<T>> ListAsync();
    Task<T> AddAsync(T entity);
    Task<int> AddRangeAsync(IReadOnlyList<T> entities);
    Task<T> UpdateAsync(T entity);
    Task DeleteAsync(T entity);
    Task<int> CountAsync();
    Task<bool> AnyAsync();
    Task<int> SaveChangesAsync();
    IDbContextTransaction BeginTransaction();
    IQueryable<T> Queryable();
}
```

### Base Repository Implementation (EfRepository<T>)

**Location:** `core/Core/Foundations/EfRepository.cs`

```csharp
public class EfRepository<T>(ApplicationDbContext context, IHCAService hcaService) : IAsyncRepository<T> 
    where T : class
{
    protected readonly ApplicationDbContext _context = context;
    protected readonly IHCAService _hcaService = hcaService;

    public async Task<T> AddAsync(T entity)
    {
        if (entity is IAuditEntity auditEntity)
        {
            auditEntity.CreatedDate = DateTime.UtcNow;
            auditEntity.CreatedBy = _hcaService.GetUserId();
        }
        await _context.Set<T>().AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<T> UpdateAsync(T entity)
    {
        if (entity is IAuditEntity auditEntity)
        {
            auditEntity.ModifiedDate = DateTime.UtcNow;
            auditEntity.ModifiedBy = _hcaService.GetUserId();
        }
        _context.Entry(entity).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return entity;
    }
}
```

### Specialized Repository Example (ArticleRepository)

**Location:** `core/Infrastructure/Repositories/ArticleRepository.cs`

Extends `EfRepository<Catalog>` and implements `IArticleRepository`:
- Inherits all basic CRUD operations from EfRepository
- Adds domain-specific queries like:
  - `GetByNameAsync()`
  - `GetRandomsAsync()`
  - `GetTotalViewCountAsync()`
  - `ListAsync(ArticleFilterOptions filterOptions)`

### Repository Responsibilities:
1. **Data Access:** Execute queries against ApplicationDbContext
2. **Entity Tracking:** Manage EF Core entity state
3. **Query Building:** Complex LINQ queries with joins and aggregations
4. **Pagination Support:** Work with FilterOptions for limit/offset

### Repository Hierarchy:
```
IAsyncRepository<T> (base interface)
    ↓
EfRepository<T> (base implementation with audit support)
    ↓
Specialized Repositories (ArticleRepository, CatalogRepository, etc.)
    ↓
Specialized Interfaces (IArticleRepository, ICatalogRepository, etc.)
```

## 3. DTO/Model Structures for Create/Update Operations

### Result Models

**TResult** - Generic operation result:
```csharp
public class TResult
{
    public bool Succeeded { get; protected set; }
    public string Message { get; }
    public object? Data { get; }
    
    public static TResult Success => _success;
    public static TResult Failed(string message) { ... }
    public static TResult Ok(object? data) { ... }
    public static TResult DuplicateRecord => Failed("Duplicate record exists.");
}

public class TResult<T> // Generic typed result
{
    public bool Succeeded { get; protected set; }
    public T? Data { get; }
    public string Message { get; }
}
```

### ListResult - Pagination support:
```csharp
public class ListResult<T> where T : class
{
    public IEnumerable<T> Data { get; set; }
    public int Total { get; set; }
    public bool Succeeded { get; }
    public string? Message { get; private set; }
    public Pagination Pagination { get; set; }
    
    public bool HasNextPage { get; }
    public bool HasPreviousPage { get; }
    public bool HasData { get; }
    
    public static async Task<ListResult<T>> Success(
        IQueryable<T> query, 
        IFilterOptions filterOptions) { ... }
}
```

### Filter/Options Base Classes

**FilterOptions** - Base for all filter parameters:
```csharp
public interface IFilterOptions
{
    int Current { get; set; }  // Page number (1-based)
    int PageSize { get; set; }  // Items per page (default: 10)
}

public class FilterOptions : IFilterOptions
{
    [JsonPropertyName("current")]
    public int Current { get; set; } = 1;
    
    [JsonPropertyName("pageSize")]
    public int PageSize { get; set; } = 10;
    
    public string Locale { get; set; } = "vi-VN";
}
```

**CatalogFilterOptions** - Specialized filter example:
```csharp
public class CatalogFilterOptions : FilterOptions
{
    // Search criteria
    public string? Name { get; set; }
    public bool? Active { get; set; }
    public CatalogType? Type { get; set; }
    public Guid? ParentId { get; set; }
    public string? CreatedBy { get; set; }
    
    // Sort order
    public SortOrder? ViewCount { get; set; }
    public SortOrder? CreatedDate { get; set; }
}
```

**ArticleFilterOptions** - Inherits from FilterOptions:
```csharp
public class ArticleFilterOptions : FilterOptions
{
    public string? Name { get; set; }
}
```

### Create/Update Arguments (Dtos)

**Location:** `core/Models/Args/`

```csharp
public class CreateTagArgs
{
    public string? Name { get; set; }
}

// Other common patterns:
// - Inherit from entity or similar structure
// - Minimal required properties
// - Named with "Args", "CreateXxxArgs", "UpdateXxxArgs" suffix
```

## 4. Frontend Service Patterns

**Location:** `admin/src/services/`

### Frontend Service Structure

All frontend services use the `@umijs/max` request utility:

```typescript
import { request } from '@umijs/max';
```

### Component Frontend Service Example:

```typescript
export async function getComponent(id: string | undefined) {
  return request(`component/${id}`);
}

export async function addComponent(data: API.Component) {
  return request(`component/add`, {
    method: 'POST',
    data,
  });
}

export async function updateComponent(data: API.Component) {
  return request(`component/update`, {
    method: 'POST',
    data,
  });
}

export async function listComponent(params: {
  current?: number;
  pageSize?: number;
}) {
  return request(`component/list`, {
    params,
  });
}

export async function deleteComponent(id?: string) {
  return request(`component/delete/${id}`, {
    method: 'POST',
  });
}
```

### Catalog Frontend Service (More Complex):

```typescript
export async function listCatalog(params: {
  current?: number;
  pageSize?: number;
  type?: CatalogType;
  parentId?: string;
  locale?: string;
}, sort: Record<string, SortOrder>) {
  return request('catalog/list', {
    method: 'GET',
    params: {
      viewCount: sort.viewCount ? (sort.viewCount === 'ascend' 
        ? ESortOrder.Ascending 
        : ESortOrder.Descending) 
        : ESortOrder.Unspecified,
      modifiedDate: sort.modifiedDate ? (sort.modifiedDate === 'ascend' 
        ? ESortOrder.Ascending 
        : ESortOrder.Descending) 
        : ESortOrder.Unspecified,
      ...params,
    },
  });
}

export async function saveCatalog(data: API.Catalog) {
  return request(`catalog/save`, {
    method: 'POST',
    data,
  });
}
```

### Frontend Service Patterns:

1. **Function-based exports** - No class-based services
2. **Request utility abstraction** - Uses `@umijs/max` request
3. **URL routing:**
   - GET: `resource/${id}` for single item
   - GET: `resource/list` with params for list
   - POST: `resource/add` for create
   - POST: `resource/update` for update
   - POST: `resource/delete/${id}` for delete
4. **Type safety:** Uses `API.*` type annotations (from typings)
5. **Async/Await:** All functions are async
6. **Parameter handling:** 
   - Query params for GET requests
   - Data object for POST requests

## 5. API Route Naming Conventions

### Controller Method Mapping:
```
GET    /api/{resource}/{id}           → Get single item
GET    /api/{resource}/list           → List with filters
POST   /api/{resource}/add            → Create new
POST   /api/{resource}/update         → Update existing
POST   /api/{resource}/delete/{id}    → Delete item
POST   /api/{resource}/active/{id}    → Toggle active status
POST   /api/{resource}/save           → Upsert operation
```

### Special Routes:
```
/api/{resource}/form-select          → Get dropdown options
/api/{resource}/tree                 → Get hierarchical tree
/api/{resource}/list-tag/{id}        → Get related items
```

## 6. Entity Audit Support

Entities implementing `IAuditEntity` automatically get:
```csharp
public interface IAuditEntity
{
    DateTime CreatedDate { get; set; }
    string CreatedBy { get; set; }
    DateTime ModifiedDate { get; set; }
    string ModifiedBy { get; set; }
}
```

Audit fields are automatically set by `EfRepository<T>.AddAsync()` and `UpdateAsync()`:
- CreatedDate/CreatedBy set on creation
- ModifiedDate/ModifiedBy set on update
- Retrieved from `IHCAService.GetUserId()`

## 7. Service Interface Organization

**Location:** `core/Core/Interfaces/IService/`

Services are organized by domain:
- `IArticleService` - Article operations
- `ICatalogService` - Catalog/Product operations
- `IComponentService` - UI Component operations
- `IUserService` - User management
- `ITagService` - Tag management
- `ILocalizationService` - Localization/i18n
- etc.

Each service interface:
- Defines contract for service implementation
- Returns `TResult`, `TResult<T>`, or `ListResult<T>`
- Uses async/await pattern exclusively
- Accepts strongly-typed parameters (entities, filter options)

## 8. Summary of Key Patterns

| Pattern | Location | Key Files |
|---------|----------|-----------|
| **Service Interface** | `Core/Interfaces/IService/` | `IArticleService.cs` |
| **Service Implementation** | `Core/Services/` | `ArticleService.cs` |
| **Repository Interface** | `Core/Interfaces/IRepository/` | `IArticleRepository.cs` |
| **Repository Base** | `Core/Foundations/` | `EfRepository.cs` |
| **Repository Implementation** | `Infrastructure/Repositories/` | `ArticleRepository.cs` |
| **Result Models** | `Core/Foundations/Models/` | `TResult.cs` |
| **Pagination** | `Models/` | `ListResult.cs` |
| **Filter Options** | `Models/` | `FilterOptions.cs`, `ArticleFilterOptions.cs` |
| **Frontend Services** | `admin/src/services/` | `catalog.ts`, `component.ts` |
| **Request Utility** | UmiJS max plugin | Uses `@umijs/max` |

## 9. Common CRUD Implementation Example

### Backend (C#):
1. **Interface defines contract**
2. **Service handles business logic** (validation, normalization)
3. **Repository executes queries**
4. **Results wrapped in TResult/ListResult**
5. **Audit fields auto-managed**

### Frontend (TypeScript):
1. **Service function for each operation**
2. **Uses request utility from @umijs/max**
3. **Parameters normalized for API**
4. **Returns response from backend**

