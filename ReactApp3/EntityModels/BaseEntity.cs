using EntityModels.Enums;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EntityModels
{
    // Tüm entity sınıfları için temel sınıf
    public abstract class BaseEntity : IUserIDEntity
    {
        // Bu property, veri tabanında otomatik olarak birincil anahtar (Primary Key) olarak atanır
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        // Kayıt durumunu belirtir (Aktif veya Pasif)
        public RecordStatus RecordStatus { get; set; }

        // Kaydın oluşturulma zamanını tutar
        public DateTime RecordTime { get; set; }
    }
}
