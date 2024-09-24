using Microsoft.AspNetCore.Mvc;
using ReactApp3.Server.Dto;

namespace reactapp6.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        // Loglama i�lemleri i�in ILogger kullan�l�r
        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        // Rastgele 5 g�nl�k hava tahmini d�ner
        [HttpGet(Name = "GetWeatherForecast")]
        public IEnumerable<WeatherForecast> Get()
        {
            // 5 g�nl�k rastgele hava tahmini olu�turur
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                // Tahmin edilen tarih, bug�nden itibaren index kadar g�n sonra
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),

                // S�cakl�k de�eri rastgele olarak -20 ile 55 aras�nda belirlenir
                TemperatureC = Random.Shared.Next(-20, 55),
            })
            .ToArray(); // Sonu�lar bir dizi olarak d�nd�r�l�r
        }
    }
}
