using EntityModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Interface
{
    // Kullanıcı repository'si için özel metotları tanımlayan arayüz
    public interface IUserRepository : IRepository<User>
    {
        // Kullanıcı adı ile kullanıcıyı getiren metot
        public User GetByUserName(string username);
    }
}
