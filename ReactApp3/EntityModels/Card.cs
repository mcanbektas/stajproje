using EntityModels.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EntityModels
{
    // Kart bilgilerini tutan sınıf, BaseEntity'den türetilmiştir
    public class Card : BaseEntity
    {
        // Kartın türünü belirtir (örneğin, kredi kartı, iş kartı vb.)
        public string Type { get; set; }

        // Kartla ilgili açıklama bilgisi
        public string Description { get; set; }

        // Kartın bağlı olduğu departmanı belirtir
        public Department Department { get; set; }
    }
}
