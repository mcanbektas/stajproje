using ReactApp3.Server.Dto;

// Kullanıcı-kart ilişkisini taşıyan DTO (Data Transfer Object) sınıfı
public class UserCardRelationDto
{
    // Kullanıcının benzersiz kimliği (ID)
    public int UserId { get; set; }

    // İlişkili kart bilgileri (CardDto)
    public CardDto Card { get; set; }
}
