namespace ReactApp3.Server.Dto
{
    public class NameCast
    {
        // Varsayılan olarak NameCast kaydının oluşturulma tarihini tutar
        public DateOnly Date { get; set; } = DateOnly.FromDateTime(DateTime.Now);

        // Kişinin adı, opsiyonel bir alan
        public string? name { get; set; }

        // Kişinin soyadı, opsiyonel bir alan
        public string? surname { get; set; }

        // Yaş, doğrudan set edilmeyen opsiyonel bir alan (Doğum yılına göre hesaplanır)
        public int? age { get; set; }

        // Kişinin doğum yılı
        public int birthofyear { get; set; }

        // Kişinin yaşadığı şehir, opsiyonel bir alan
        public string? city { get; set; }

        // Yaşı hesaplayan metod (Şu anki yıl ile doğum yılı arasındaki farkı alır)
        public int FindAge()
        {
            return Date.Year - birthofyear;
        }
    }
}
