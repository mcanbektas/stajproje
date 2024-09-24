using System;

namespace EntityModels.Enums
{
    // Kullanıcıların unvanlarını belirleyen enum
    public enum UserTitle
    {
        Asistant = 0,   // Yardımcı seviye
        Mid = 1,        // Orta seviye
        Senior = 2,     // Kıdemli seviye
        HeadOf = 3,     // Bölüm başkanı seviye
    }

    // Kayıt durumlarını belirten enum (aktif veya pasif)
    public enum RecordStatus
    {
        Passive = 0,    // Pasif kayıt
        Active = 1,     // Aktif kayıt
    }

    // Departmanları belirleyen enum
    public enum Department
    {
        UygulamaMimarisi = 0,   // Uygulama Mimarisi departmanı
        MobilUygulama = 1,      // Mobil Uygulama departmanı
        WebSitesi = 2,          // Web Sitesi departmanı
        IT = 3,                 // Bilgi Teknolojileri (IT) departmanı
        İnsanKaynakları = 4,    // İnsan Kaynakları departmanı
    }
}
