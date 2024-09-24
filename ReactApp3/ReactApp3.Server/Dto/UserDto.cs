using EntityModels.Enums;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ReactApp3.Server.Dto
{
    // Kullanıcı bilgilerini taşıyan DTO (Data Transfer Object) sınıfı
    public class UserDto
    {
        // Kullanıcının benzersiz kimliği (ID)
        public int Id { get; set; }

        // Kullanıcının kullanıcı adı
        public required string UserName { get; set; }

        // Kullanıcının ilk adı
        public required string FirstName { get; set; }

        // Kullanıcının soyadı
        public required string SurName { get; set; }

        // Kullanıcının unvanı (örneğin: Asistant, Mid, Senior)
        public UserTitle Title { get; set; }
    }
}
