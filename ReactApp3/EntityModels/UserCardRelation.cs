using System.ComponentModel.DataAnnotations.Schema;

namespace EntityModels
{
    // Kullanıcı ve kart arasındaki ilişkiyi temsil eden sınıf, BaseEntity'den türetilmiştir
    public class UserCardRelation : BaseEntity
    {
        // İlişkinin ait olduğu kullanıcının ID'si
        public int UserId { get; set; }

        // İlişkinin ait olduğu kartın ID'si
        public int CardId { get; set; }

        // Kullanıcı ile ilişki kurmak için UserId'yi dış anahtar olarak kullanır
        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        // Kart ile ilişki kurmak için CardId'yi dış anahtar olarak kullanır
        [ForeignKey("CardId")]
        public virtual Card Card { get; set; }
    }
}
