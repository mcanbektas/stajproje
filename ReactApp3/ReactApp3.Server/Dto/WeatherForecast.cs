namespace ReactApp3.Server.Dto
{
    public class WeatherForecast
    {
        // Hava tahmini için tarih bilgisi
        public DateOnly Date { get; set; }

        // Celsius cinsinden sıcaklık
        public int TemperatureC { get; set; }

        // Fahrenheit cinsinden sıcaklık (Celsius sıcaklıktan hesaplanır)
        public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);

        // Kelvin cinsinden sıcaklık (Celsius sıcaklıktan hesaplanır)
        public decimal TemperatureK => (decimal)(TemperatureC + 273.15);

        // Sayıları kelimelere çeviren bir metod 
        public string ConvertNumberToWords(int number)
        {
            if (number == 0)
                return "sıfır";

            string[] ones = { "", "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz" };
            string[] tens = { "", "on", "yirmi", "otuz", "kırk", "elli", "altmış", "yetmiş", "seksen", "doksan" };

            if (number < 0)
            {
                return "eksi" + " " + ConvertNumberToWords(Math.Abs(number));
            }
            if (number < 10)
                return ones[number];

            if (number < 100)
                return tens[number / 10] + " " + ones[number % 10];

            return number.ToString();
        }

        // Sıcaklık için açıklama döndüren metod 
        public string GetTemperatureDescription(int TemperatureC)
        {
            if (TemperatureC < 0)
            {
                return "Buz gibi";
            }
            else if (TemperatureC >= 0 && TemperatureC < 10)
            {
                return "çok soğuk";
            }
            else if (TemperatureC >= 10 && TemperatureC < 20)
            {
                return "Soğuk";
            }
            else if (TemperatureC >= 20 && TemperatureC < 30)
            {
                return "Ilık";
            }
            else if (TemperatureC >= 30 && TemperatureC < 40)
            {
                return "Sıcak";
            }
            else if (TemperatureC >= 40)
            {
                return "çok sıcak";
            }
            else
            {
                return "Bilinmeyen sıcaklık";
            }
        }

        // Sıcaklığı kelimelerle döndüren property
        public string TemperatureS => ConvertNumberToWords(TemperatureC);

        // Sıcaklık hakkında açıklama döndüren property
        public string Summary => GetTemperatureDescription(TemperatureC);
    }
}
