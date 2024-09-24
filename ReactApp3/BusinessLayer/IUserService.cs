using EntityModels;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BusinessLayer
{
    // Kullanıcılarla ilgili işlemleri yöneten servis arayüzü
    public interface IUserService
    {
        // Tüm kullanıcıları asenkron olarak getirir
        Task<IEnumerable<User>> GetAllUsersAsync();

        // Belirtilen ID'ye sahip kullanıcıyı asenkron olarak getirir
        Task<User> GetUserByIdAsync(int id);

        // Yeni bir kullanıcı oluşturur
        Task CreateUserAsync(User user);

        // Var olan bir kullanıcıyı günceller
        Task UpdateUserAsync(User user);

        // Belirtilen ID'ye sahip kullanıcıyı siler
        Task DeleteUserAsync(int id);
    }
}
