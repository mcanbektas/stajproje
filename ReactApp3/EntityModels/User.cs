using EntityModels.Enums;

namespace EntityModels
{
    // Kullanıcı bilgilerini tutan sınıf, BaseEntity'den türetilmiştir
    public class User : BaseEntity
    {
        // Kullanıcının kullanıcı adı
        public required string Username { get; set; }

        // Kullanıcının ilk adı
        public required string Firstname { get; set; }

        // Kullanıcının soyadı
        public required string Surname { get; set; }

        // Kullanıcının unvanı (örneğin: Asistant, Senior)
        public required UserTitle Title { get; set; }

        // Kullanıcının kart ilişkilerini tutar (kullanıcının sahip olduğu kartlarla olan ilişkiler)
        public virtual ICollection<UserCardRelation> UserCardRelations { get; set; }
    }
}
