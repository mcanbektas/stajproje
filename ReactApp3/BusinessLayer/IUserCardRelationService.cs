using EntityModels;
using System.Threading.Tasks;

namespace BusinessLayer
{
    // Kullanıcı ve kart ilişkilerini yöneten servis arayüzü
    public interface IUserCardRelationService
    {
        // Yeni bir kullanıcı-kart ilişkisi oluşturmak için asenkron fonksiyon
        Task CreateUserCardRelationAsync(UserCardRelation userCardRelation);

        // Belirtilen kart ID'sine göre kullanıcı-kart ilişkisini getirir
        Task<UserCardRelation> GetByCardIdAsync(int cardId);

        // Tüm kullanıcı-kart ilişkilerini getirir
        Task<IEnumerable<UserCardRelation>> GetAllUserCardRelationsAsync();
    }
}
