using EntityModels;
using EntityModels.Enums;

namespace ReactApp3.Server.Dto
{
    // Kullanıcı ve kart ilişkilerini taşıyan DTO (Data Transfer Object) sınıfı
    public class UserWithCardsDto
    {
        // Kullanıcının benzersiz kimliği (ID)
        public int Id { get; set; }

        // Kullanıcının kullanıcı adı
        public string UserName { get; set; }

        // Kullanıcının ilk adı
        public string FirstName { get; set; }

        // Kullanıcının soyadı
        public string SurName { get; set; }

        // Kullanıcının unvanı (örneğin: Asistant, Mid, Senior)
        public UserTitle Title { get; set; }

        // Kullanıcının sahip olduğu kartların listesi
        public List<CardDto> Cards { get; set; }
    }

}
