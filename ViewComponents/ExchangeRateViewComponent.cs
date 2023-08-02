using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Helpers;
using Waffle.Core.Interfaces.IService;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    [ViewComponent(Name = "EXCHANGERATE")]
    public class ExchangeRateViewComponent : BaseViewComponent<ExchangeRate>
    {
        private readonly HttpClient _httpClient;
        public ExchangeRateViewComponent(HttpClient httpClient, IWorkService workService) : base(workService)
        {
            _httpClient = httpClient;
        }

        protected override async Task<ExchangeRate?> ExtendAsync(ExchangeRate? work)
        {
            work ??= new();
            var response = await _httpClient.GetStreamAsync("https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx");
            var data = XmlHelper.Deserialize<ExrateList>(response);
            work.ExrateList = data ?? new();
            return work;
        }
    }
}
