using Microsoft.AspNetCore.Mvc;
using ReactApp3.Server.Dto;
using System;
using System.Collections.Generic;

namespace ReactApp3.Server.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class NameCastController : Controller
    {
        #region private members
        // Rastgele ad ve soyad verilerini tutan listeler
        private static readonly string[] names = new[] { "can", "ikbal", "musa", "burak", "rıfat", "mahmut", "fahri", "enes", "yusuf", "yunus" };
        private static readonly string[] surnames = new[] { "bektaş", "ışık", "bora", "öztürk", "kocameşe", "akça", "demirhan", "umur", "yıldız" };

        // Rastgele doğum yıllarını tutan liste
        private static readonly int[] birthYears = new[] { 1972, 1992, 2002, 1979, 2006, 2004, 1997, 1993, 2000, 1982 };

        // Şehir adlarını tutan liste
        private static readonly string[] cities = new[] { "istanbul", "izmir", "trabzon", "şırnak", "balıkesir", "edirne", "sakarya", "düzce", "kars" };

        // Post edilen `NameCastPost` verilerini tutan liste
        private static List<NameCastPost> _nameCastPosts = new List<NameCastPost>();
        #endregion private members

        // Rastgele oluşturulmuş NameCast verilerini geri döner
        [HttpGet(Name = "GetNameCast")]
        public ActionResult<List<NameCast>> GetNameCast()
        {
            var nameCasts = new List<NameCast>();
            var random = new Random();

            // 5 adet rastgele NameCast oluşturur
            for (int i = 0; i < 5; i++)
            {
                var name = names[random.Next(names.Length)];
                var surname = surnames[random.Next(surnames.Length)];
                var birthYear = birthYears[random.Next(birthYears.Length)];
                var city = cities[random.Next(cities.Length)];
                var age = DateTime.Now.Year - birthYear;

                // NameCast nesnelerini listeye ekler
                nameCasts.Add(new NameCast
                {
                    name = name,
                    surname = surname,
                    birthofyear = birthYear,
                    city = city,
                    age = age
                });
            }
            return Ok(nameCasts); // Oluşturulan listeyi döner
        }

        // Kullanıcıdan NameCastPost verisi alıp listeye ekler
        [HttpPost]
        [ActionName("PostNameCast")]
        public IActionResult PostNameCast([FromBody] NameCastPost nameCastPost)
        {
            if (nameCastPost == null)
            {
                return BadRequest("Geçersiz veri.");
            }
            _nameCastPosts.Add(nameCastPost);

            return Ok(new { message = "Başarılı şekilde alındı.", data = nameCastPost });
        }

        // Tüm post edilmiş NameCastPost verilerini döner
        [HttpGet]
        [ActionName("GetNameCastPost")]
        public IActionResult GetNameCastPost()
        {
            return Ok(_nameCastPosts);
        }
    }
}
