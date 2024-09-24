using Microsoft.AspNetCore.Mvc;
using ReactApp3.Server.Dto;

namespace reactapp6.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        // Loglama iþlemleri için ILogger kullanýlýr
        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        // Rastgele 5 günlük hava tahmini döner
        [HttpGet(Name = "GetWeatherForecast")]
        public IEnumerable<WeatherForecast> Get()
        {
            // 5 günlük rastgele hava tahmini oluþturur
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                // Tahmin edilen tarih, bugünden itibaren index kadar gün sonra
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),

                // Sýcaklýk deðeri rastgele olarak -20 ile 55 arasýnda belirlenir
                TemperatureC = Random.Shared.Next(-20, 55),
            })
            .ToArray(); // Sonuçlar bir dizi olarak döndürülür
        }
    }
}
