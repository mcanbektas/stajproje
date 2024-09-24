using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    // Genel repository arayüzü, TEntity tipiyle çalışan ve temel CRUD (Create, Read, Update, Delete) işlemlerini tanımlar
    public interface IRepository<TEntity> where TEntity : class
    {
        // Tüm entity'leri getiren sorgu
        IQueryable<TEntity> GetAll();

        // Belirtilen ID'ye sahip entity'yi asenkron olarak getirir
        Task<TEntity> GetByIdAsync(int id);

        // Yeni bir entity oluşturur (ekler)
        Task CreateAsync(TEntity entity);

        // Mevcut bir entity'yi günceller
        Task UpdateAsync(TEntity entity);

        // Belirtilen ID'ye sahip entity'yi siler
        Task DeleteAsync(int id);
    }
}
