using Microsoft.EntityFrameworkCore;
using Repository;
using BusinessLayer;
using EntityModels;
using Repository.Repository;
using Repository.Interface;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Servis ba��ml�l�klar�n� ��z�mlemek i�in DI (Dependency Injection) yap�land�rmas�
builder.Services.AddScoped<IUserService, UserService>();  // Kullan�c� i�lemleri i�in servis
builder.Services.AddScoped<IUserRepository, UserRepository>();  // Kullan�c� repository'si
builder.Services.AddScoped<IRepository<UserCardRelation>, Repository<UserCardRelation>>();  // Kullan�c�-Kart ili�kisi repository'si
builder.Services.AddScoped<IUserCardRelationService, UserCardRelationService>();  // Kullan�c�-Kart ili�kisi servisi
builder.Services.AddScoped<AppDbContext, AppDbContext>();  // Veritaban� ba�lam� (DbContext)

// JSON se�eneklerini yap�land�rma (serile�tirme ayarlar�)
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // D�ng�sel referanslar� korur (�rne�in, kullan�c� ve kart ili�kileri aras�nda)
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;

        // JSON serile�tirme s�ras�nda null de�erleri yazmama
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });

// D�ng�sel referanslar� g�z ard� eder (gerekli yerlerde kullan�l�r)
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });

// Enum'lar� string olarak JSON format�nda serile�tirir
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddCors();  // CORS yap�land�rmas� (farkl� k�kenlerden gelen taleplere izin vermek i�in)
builder.Services.AddControllers();  // API controller'lar�n� yap�land�r�r
builder.Services.AddEndpointsApiExplorer();  // API d�k�mantasyonu i�in u� noktalar� ke�feder
builder.Services.AddSwaggerGen();  // Swagger yap�land�rmas� (API d�k�mantasyonu i�in)

// Uygulamay� olu�tur
var app = builder.Build();

// Statik dosyalar ve varsay�lan dosya ayarlar�
app.UseDefaultFiles();
app.UseStaticFiles();

// Geli�tirme ortam� i�in Swagger yap�land�rmas�
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// CORS yap�land�rmas� (t�m k�kenler, y�ntemler ve ba�l�klar i�in izin verir)
app.UseCors(builder => builder.AllowAnyMethod().AllowAnyHeader().AllowAnyOrigin());

app.UseHttpsRedirection();  // HTTPS'yi zorunlu k�lar
app.UseAuthorization();  // Yetkilendirme i�lemleri

// T�m controller'lar� haritaland�r�r
app.MapControllers();

// SPA uygulamalar� i�in fallback (index.html dosyas�na y�nlendirir)
app.MapFallbackToFile("/index.html");

// Uygulamay� �al��t�r�r
app.Run();
