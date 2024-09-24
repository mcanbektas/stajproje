using EntityModels;
using Microsoft.EntityFrameworkCore;
using Repository;
using System.Threading.Tasks;

namespace BusinessLayer
{
    // Kullanıcı-kart ilişkilerini yöneten servis sınıfı
    public class UserCardRelationService : IUserCardRelationService
    {
        // Repository'yi bağımlılık olarak alıyoruz, böylece veri tabanı işlemlerini burada gerçekleştirebiliyoruz
        private readonly IRepository<UserCardRelation> _userCardRelationRepository;

        // Repository'nin kurucu metodla alınması
        public UserCardRelationService(IRepository<UserCardRelation> userCardRelationRepository)
        {
            _userCardRelationRepository = userCardRelationRepository;
        }

        // Belirtilen kart ID'sine sahip kullanıcı-kart ilişkisini getirir
        public async Task<UserCardRelation> GetByCardIdAsync(int cardId)
        {
            return await _userCardRelationRepository.GetAll()
                .FirstOrDefaultAsync(relation => relation.CardId == cardId);
        }

        // Yeni bir kullanıcı-kart ilişkisi oluşturur
        public async Task CreateUserCardRelationAsync(UserCardRelation userCardRelation)
        {
            await _userCardRelationRepository.CreateAsync(userCardRelation);
        }

        // Tüm kullanıcı-kart ilişkilerini getirir
        public async Task<IEnumerable<UserCardRelation>> GetAllUserCardRelationsAsync()
        {
            return await _userCardRelationRepository.GetAll().ToListAsync();
        }
    }
}
