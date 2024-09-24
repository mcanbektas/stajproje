using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace Repository
{
    // Genel repository sınıfı, CRUD işlemleri için temel işlevleri uygular
    public class Repository<TEntity> : IRepository<TEntity> where TEntity : class
    {
        private readonly AppDbContext _context;  // Veritabanı bağlamı (DbContext)
        private readonly DbSet<TEntity> _dbSet;  // TEntity için DbSet

        // Repository'nin kurucu metodu, DbContext bağımlılığını alır
        public Repository(AppDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<TEntity>();  // DbSet'i belirler
        }

        // Tüm entity'leri getirir (sorgulama için IQueryable döner)
        public IQueryable<TEntity> GetAll()
        {
            return _dbSet;
        }

        // Belirtilen ID'ye sahip entity'yi asenkron olarak getirir
        public async Task<TEntity> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);  // Entity'yi ID'ye göre bulur
        }

        // Yeni bir entity ekler ve veritabanına kaydeder
        public async Task CreateAsync(TEntity entity)
        {
            await _dbSet.AddAsync(entity);  // Yeni entity eklenir
            await _context.SaveChangesAsync();  // Değişiklikler kaydedilir
        }

        // Mevcut bir entity'yi günceller ve veritabanına kaydeder
        public async Task UpdateAsync(TEntity entity)
        {
            _dbSet.Update(entity);  // Entity güncellenir
            await _context.SaveChangesAsync();  // Değişiklikler kaydedilir
        }

        // Belirtilen ID'ye sahip entity'yi siler
        public async Task DeleteAsync(int id)
        {
            var entity = await _dbSet.FindAsync(id);  // Silinecek entity bulunur
            if (entity != null)
            {
                _dbSet.Remove(entity);  // Entity silinir
                await _context.SaveChangesAsync();  // Değişiklikler kaydedilir
            }
        }
    }
}
