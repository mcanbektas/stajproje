using EntityModels;
using EntityModels.Enums;
using Microsoft.EntityFrameworkCore;
using Repository;
using Repository.Interface;

namespace BusinessLayer
{
    // Kullanıcı servis sınıfı, kullanıcı işlemlerini yönetir
    public class UserService : IUserService
    {
        // Kullanıcı repository'sini bağımlılık olarak alıyoruz
        private readonly IUserRepository _userRepository;

        // Repository'nin kurucu metodla alınması
        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        // Tüm kullanıcıları getirir
        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _userRepository.GetAll().ToListAsync();
        }

        // Belirtilen ID'ye sahip kullanıcıyı getirir
        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _userRepository.GetByIdAsync(id);
        }

        // Yeni bir kullanıcı oluşturur
        public async Task CreateUserAsync(User user)
        {
            // Kullanıcının başlık bilgisinin (Title) geçerli olup olmadığını kontrol eder
            bool titleValid = Enum.IsDefined(typeof(UserTitle), user.Title);
            if (!titleValid)
            {
                throw new InvalidOperationException("Geçersiz veri");
            }

            // Aynı kullanıcı adına sahip başka bir kullanıcı olup olmadığını kontrol eder
            var currentUser = _userRepository.GetByUserName(user.Username);
            if (currentUser != null)
            {
                throw new InvalidOperationException("Bu kullanıcı adıyla kullanıcı mevcut!");
            }

            // Yeni kullanıcıyı veri tabanına ekler
            await _userRepository.CreateAsync(user);
        }

        // Mevcut bir kullanıcıyı günceller
        public async Task UpdateUserAsync(User user)
        {
            await _userRepository.UpdateAsync(user);
        }

        // Belirtilen ID'ye sahip kullanıcıyı siler
        public async Task DeleteUserAsync(int id)
        {
            await _userRepository.DeleteAsync(id);
        }
    }
}
