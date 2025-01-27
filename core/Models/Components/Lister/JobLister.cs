using System.ComponentModel.DataAnnotations;
using Waffle.Core.Foundations;
using Waffle.Models.ViewModels;

namespace Waffle.Models.Components.Lister;

[Display(Name = "Job Lister", Prompt = nameof(JobLister))]
public class JobLister : AbstractComponent
{
    public ListResult<CatalogListItem>? Catalogs { get; set; }
}
