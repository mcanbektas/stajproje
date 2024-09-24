using Microsoft.EntityFrameworkCore;
using Repository;
using BusinessLayer;
using EntityModels;
using Repository.Repository;
using Repository.Interface;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Servis baðýmlýlýklarýný çözümlemek için DI (Dependency Injection) yapýlandýrmasý
builder.Services.AddScoped<IUserService, UserService>();  // Kullanýcý iþlemleri için servis
builder.Services.AddScoped<IUserRepository, UserRepository>();  // Kullanýcý repository'si
builder.Services.AddScoped<IRepository<UserCardRelation>, Repository<UserCardRelation>>();  // Kullanýcý-Kart iliþkisi repository'si
builder.Services.AddScoped<IUserCardRelationService, UserCardRelationService>();  // Kullanýcý-Kart iliþkisi servisi
builder.Services.AddScoped<AppDbContext, AppDbContext>();  // Veritabaný baðlamý (DbContext)

// JSON seçeneklerini yapýlandýrma (serileþtirme ayarlarý)
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Döngüsel referanslarý korur (örneðin, kullanýcý ve kart iliþkileri arasýnda)
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;

        // JSON serileþtirme sýrasýnda null deðerleri yazmama
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });

// Döngüsel referanslarý göz ardý eder (gerekli yerlerde kullanýlýr)
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });

// Enum'larý string olarak JSON formatýnda serileþtirir
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddCors();  // CORS yapýlandýrmasý (farklý kökenlerden gelen taleplere izin vermek için)
builder.Services.AddControllers();  // API controller'larýný yapýlandýrýr
builder.Services.AddEndpointsApiExplorer();  // API dökümantasyonu için uç noktalarý keþfeder
builder.Services.AddSwaggerGen();  // Swagger yapýlandýrmasý (API dökümantasyonu için)

// Uygulamayý oluþtur
var app = builder.Build();

// Statik dosyalar ve varsayýlan dosya ayarlarý
app.UseDefaultFiles();
app.UseStaticFiles();

// Geliþtirme ortamý için Swagger yapýlandýrmasý
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// CORS yapýlandýrmasý (tüm kökenler, yöntemler ve baþlýklar için izin verir)
app.UseCors(builder => builder.AllowAnyMethod().AllowAnyHeader().AllowAnyOrigin());

app.UseHttpsRedirection();  // HTTPS'yi zorunlu kýlar
app.UseAuthorization();  // Yetkilendirme iþlemleri

// Tüm controller'larý haritalandýrýr
app.MapControllers();

// SPA uygulamalarý için fallback (index.html dosyasýna yönlendirir)
app.MapFallbackToFile("/index.html");

// Uygulamayý çalýþtýrýr
app.Run();
