using BusinessLayer;
using EntityModels;
using EntityModels.Enums;
using Microsoft.AspNetCore.Mvc;
using ReactApp3.Server.Dto;
using System;
using System.Threading.Tasks;

namespace ReactApp3.Server.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    // Kullanıcı işlemlerini yöneten API kontrolcüsü
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IUserCardRelationService _userCardRelationService;

        // Kullanıcı ve kullanıcı-kart ilişkisi servislerini kurucu metodla alıyoruz
        public UserController(IUserService userService, IUserCardRelationService userCardRelationService)
        {
            _userService = userService;
            _userCardRelationService = userCardRelationService;
        }

        // Yeni bir kullanıcı oluşturma işlemi
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] UserDto userDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);  // Geçersiz model durumu kontrolü
            }

            try
            {
                // Kullanıcı DTO'sundan gelen verilerle yeni bir User nesnesi oluştururuz
                var user = new User
                {
                    Username = userDto.UserName,
                    Firstname = userDto.FirstName,
                    Surname = userDto.SurName,
                    Title = userDto.Title,
                    RecordTime = DateTime.Now
                };

                // Kullanıcıyı veri tabanına ekleriz
                await _userService.CreateUserAsync(user);
                return Ok(new { message = "Kullanıcı başarıyla oluşturuldu." });
            }
            catch (Exception ex)
            {
                // Hata durumunda loglama ve hata mesajı döndürme
                return StatusCode(500, $"Sunucu hatası: {ex.Message}");
            }
        }

        // Tüm kullanıcıları listeleyen işlem
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _userService.GetAllUsersAsync();

                // Kullanıcıların kart bilgileriyle birlikte anonim nesneler döneriz
                var usersWithCardDetails = users.Select(user => new
                {
                    user.Id,
                    Username = user.Username,
                    FirstName = user.Firstname,
                    SurName = user.Surname,
                    Title = user.Title,
                    Card = user.UserCardRelations != null && user.UserCardRelations.Any()
                        ? user.UserCardRelations.First().Card  // Kullanıcının ilk kartını döner
                        : null
                }).ToList();

                return Ok(usersWithCardDetails);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Sunucu hatası: {ex.Message}");
            }
        }

        // Belirtilen ID'ye sahip kullanıcının detaylarını getirir
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
                        : new List<CardDto>() // Eğer ilişkili kart yoksa boş bir liste döner
                };

                return Ok(userWithCardsDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Belirtilen ID'ye sahip kullanıcıyı silme işlemi
        [HttpDelete]
        public async Task<IActionResult> DeleteUser([FromQuery] int id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);
                if (user == null)
                {
                    return NotFound($"User with id {id} not found.");  // Kullanıcı bulunamazsa
                }

                // Kullanıcıyı silme işlemi
                await _userService.DeleteUserAsync(id);
                return Ok(new { message = "User deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
