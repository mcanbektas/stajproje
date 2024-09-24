using EntityModels;
using Repository.Interface;
using EntityModels.Enums;
using Microsoft.EntityFrameworkCore;

namespace Repository.Repository
{
    // Kullanıcı repository'sini yöneten sınıf, IUserRepository arayüzünü ve Repository<User> sınıfını uygular
    public class UserRepository : Repository<User>, IUserRepository
    {
        private readonly AppDbContext _context;

        // AppDbContext'i bağımlılık olarak alıp base sınıfa iletir
        public UserRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        // Kullanıcı adını alarak kullanıcıyı getiren metot
        public User GetByUserName(string username)
        {
            // Veritabanından kullanıcıyı getirirken performans için izleme yapılmaz
            return _context.Users
                .AsNoTracking()  // Veritabanına fazladan izleme yapmamak için (performans optimizasyonu)
                .SingleOrDefault(s => s.Username.ToLower() == username.ToLower());  // Kullanıcı adı ile eşleşen kullanıcıyı bulur
        }
    }
}
