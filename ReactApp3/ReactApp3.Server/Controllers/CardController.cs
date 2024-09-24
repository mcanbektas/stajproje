using BusinessLayer;
using EntityModels.Enums;
using EntityModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactApp3.Server.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactApp3.Server.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    // Kart işlemlerini yöneten API kontrolcüsü
    public class CardController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IUserCardRelationService _userCardRelationService;

        // Kullanıcı ve kullanıcı-kart ilişkisi servislerini kurucu metodla alıyoruz
        public CardController(IUserService userService, IUserCardRelationService userCardRelationService)
        {
            _userService = userService;
            _userCardRelationService = userCardRelationService;
        }

        // Yeni bir kullanıcı-kart ilişkisi oluşturur
        [HttpPost]
        public async Task<IActionResult> CreateUserCardRelation([FromBody] UserCardRelationDto userCardRelationDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);  // Geçersiz model durumu kontrolü
            }

            try
            {
                // Dto'dan gelen kart bilgilerini kullanarak bir Card nesnesi oluşturuyoruz
                var department = (Department)userCardRelationDto.Card.Department;
                var recordStatus = (RecordStatus)userCardRelationDto.Card.RecordStatus;

                var card = new Card
                {
                    Type = userCardRelationDto.Card.Type,
                    Description = userCardRelationDto.Card.Description,
                    Department = department,
                    RecordStatus = recordStatus,
                    RecordTime = DateTime.Now
                };

                // Yeni bir kullanıcı-kart ilişkisi oluşturuyoruz
                var userCardRelation = new UserCardRelation
                {
                    UserId = userCardRelationDto.UserId,
                    Card = card,
                    RecordStatus = RecordStatus.Active,
                    RecordTime = DateTime.Now
                };

                // Servisi kullanarak ilişkiyi veri tabanına ekliyoruz
                await _userCardRelationService.CreateUserCardRelationAsync(userCardRelation);

                // İşlem başarılı olursa geri dönüş mesajı
                return Ok(new
                {
                    message = "User-Card relation created successfully.",
                    cardId = card.Id,
                    userId = userCardRelationDto.UserId
                });
            }
            catch (Exception ex)
            {
                // Hata durumunda loglama ve hata mesajı döndürme
                Console.WriteLine($"Internal server error: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Belirtilen ID'ye sahip kullanıcının detaylarını ve kart ilişkilerini getirir
        [HttpGet]
        public async Task<IActionResult> GetUserDetails([FromQuery] int id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);
                if (user == null)
                {
                    return NotFound($"User with id {id} not found.");  // Kullanıcı bulunamazsa
                }

                // Kullanıcı ve kart ilişkilerini bir DTO ile döneriz
                var userWithCardsDto = new UserWithCardsDto
                {
                    Id = user.Id,
                    UserName = user.Username,
                    FirstName = user.Firstname,
                    SurName = user.Surname,
                    Title = user.Title,
                    Cards = user.UserCardRelations != null
                        ? user.UserCardRelations.Select(relation => new CardDto
                        {
                            Id = relation.Card.Id,
                            Type = relation.Card.Type,
                            Description = relation.Card.Description,
                            Department = relation.Card.Department,
                            RecordStatus = relation.Card.RecordStatus
                        }).ToList()
                        : new List<CardDto>()
                };

                return Ok(userWithCardsDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Tüm kullanıcı-kart ilişkilerini getirir
        [HttpGet]
        public async Task<IActionResult> GetAllCards()
        {
            try
            {
                var cardRelations = await _userCardRelationService.GetAllUserCardRelationsAsync();

                // Her kullanıcı-kart ilişkisini anonim bir nesne ile döneriz
                var result = cardRelations.Select(relation => new
                {
                    UserId = relation.UserId,
                    Card = new
                    {
                        Id = relation.Card.Id,
                        Type = relation.Card.Type,
                        Description = relation.Card.Description,
                        Department = relation.Card.Department,
                        RecordStatus = relation.Card.RecordStatus,
                        RecordTime = relation.Card.RecordTime
                    }
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Tüm departmanların listesini döner (enum değerlerini kullanarak)
        [HttpGet]
        public IActionResult GetDepartments()
        {
            var departments = Enum.GetValues(typeof(Department));
            var departmentList = new List<object>();

            // Enum değerlerini label ve value olarak listeye ekleriz
            foreach (var department in departments)
            {
                departmentList.Add(new
                {
                    Value = (int)department,
                    Label = department.ToString()
                });
            }

            return Ok(departmentList);
        }
    }
}
