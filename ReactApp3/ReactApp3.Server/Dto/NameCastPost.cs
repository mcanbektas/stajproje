namespace ReactApp3.Server.Dto
{
    public class NameCastPost
    {
        // Post edilen verinin Id'si
        public int Id { get; set; }

        // Kullanıcının adı
        public required string Name { get; set; }

        // Model bilgisi (Bu projede örnek olarak gönderiliyor)
        public required string Model { get; set; }

        // Post edilen verinin kayıt zamanı
        public DateTime RecordTime { get; set; }
    }
}
