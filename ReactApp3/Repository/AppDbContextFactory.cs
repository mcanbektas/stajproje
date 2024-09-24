﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Repository
{
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();

            
            optionsBuilder.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=myDataBase;Trusted_Connection=True;");

            return new AppDbContext(optionsBuilder.Options);
        }
    }
}
