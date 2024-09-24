using Microsoft.EntityFrameworkCore;
using EntityModels;

namespace Repository
{
    // Veritabanı bağlamı (DbContext), uygulamadaki entity'ler ile veritabanı arasındaki işlemleri yönetir
    public class AppDbContext : DbContext
    {
        // Kullanıcılar için DbSet (veritabanındaki User tablosunu temsil eder)
        public DbSet<User> Users { get; set; }

        // Kartlar için DbSet (veritabanındaki Card tablosunu temsil eder)
        public DbSet<Card> Cards { get; set; }

        // Kullanıcı-kart ilişkileri için DbSet (veritabanındaki UserCardRelation tablosunu temsil eder)
        public DbSet<UserCardRelation> UserCardRelations { get; set; }

        // Veritabanı yapılandırmasını burada yapıyoruz
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Lazy loading etkinleştirilir (ilişkili veriler ihtiyaç duyulana kadar yüklenmez)
            optionsBuilder.UseLazyLoadingProxies();

            // SQL Server bağlantı dizesi (veritabanına bağlantı ayarları)
            optionsBuilder.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=myDataBase;Trusted_Connection=True;");

            base.OnConfiguring(optionsBuilder);
        }

        // Entity modellerini yapılandırmak için kullanılır (şu anda temel yapılandırma ile)
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
