using EntityModels;
using EntityModels.Enums;

namespace ReactApp3.Server.Dto
{
    // Kart bilgilerini taşıyan DTO (Data Transfer Object) sınıfı
    public class CardDto : BaseEntity
    {
        // Kartın türünü belirtir (örneğin, kredi kartı, iş kartı vb.)
        public string Type { get; set; }

        // Kartla ilgili açıklama bilgisi
        public string Description { get; set; }

        // Kartın ait olduğu departmanı belirtir
        public Department Department { get; set; }

        // Kartın kayıt durumu (aktif veya pasif)
        public RecordStatus RecordStatus { get; set; }

        // Kartın benzersiz kimliği (ID)
        public int Id { get; set; }
    }
}
