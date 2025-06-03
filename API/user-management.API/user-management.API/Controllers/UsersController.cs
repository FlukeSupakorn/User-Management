using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using user_management.API.Data;
using user_management.API.DTOs;
using user_management.API.Models;

namespace user_management.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        
        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<UserDto>>>> GetUsers()
        {
            try
            {                var users = await _context.Users
                    .Include(u => u.Role) 
                    .Where(u => u.IsActive)
                    .Select(u => new UserDto
                    {
                        UserId = u.UserId,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        Email = u.Email,
                        Phone = u.Phone,
                        Username = u.Username,
                        RoleId = u.RoleId,
                        Role = u.Role != null ? u.Role.RoleName : "Employee", 
                        CreatedDate = u.CreatedDate,
                        UpdatedDate = u.UpdatedDate,
                        IsActive = u.IsActive
                    })
                    .ToListAsync();

                return Ok(ApiResponse<List<UserDto>>.SuccessResult(users, "Users retrieved successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<UserDto>>.FailureResult("An error occurred while retrieving users", new List<string> { ex.Message }));
            }
        }

        
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<UserDto>>> GetUser(int id)
        {
            try
            {                var user = await _context.Users
                    .Include(u => u.Role) 
                    .Where(u => u.UserId == id && u.IsActive)
                    .Select(u => new UserDto
                    {
                        UserId = u.UserId,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        Email = u.Email,
                        Phone = u.Phone,
                        Username = u.Username,
                        RoleId = u.RoleId,
                        Role = u.Role != null ? u.Role.RoleName : "Employee", 
                        CreatedDate = u.CreatedDate,
                        UpdatedDate = u.UpdatedDate,
                        IsActive = u.IsActive
                    })
                    .FirstOrDefaultAsync();

                if (user == null)
                {
                    return NotFound(ApiResponse<UserDto>.FailureResult("User not found"));
                }

                return Ok(ApiResponse<UserDto>.SuccessResult(user, "User retrieved successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<UserDto>.FailureResult("An error occurred while retrieving the user", new List<string> { ex.Message }));
            }
        }

        
        [HttpPost]
        public async Task<ActionResult<ApiResponse<UserDto>>> CreateUser(CreateUserDto createUserDto)
        {
            try
            {                
                if (string.IsNullOrWhiteSpace(createUserDto.FirstName) ||
                    string.IsNullOrWhiteSpace(createUserDto.LastName) ||
                    string.IsNullOrWhiteSpace(createUserDto.Email) ||
                    string.IsNullOrWhiteSpace(createUserDto.Username) ||
                    string.IsNullOrWhiteSpace(createUserDto.Password) ||
                    createUserDto.RoleId <= 0)
                {
                    return BadRequest(ApiResponse<UserDto>.FailureResult("All required fields must be provided"));
                }

                
                var roleExists = await _context.Roles.AnyAsync(r => r.RoleId == createUserDto.RoleId);
                if (!roleExists)
                {
                    return BadRequest(ApiResponse<UserDto>.FailureResult("Invalid role selected"));
                }

                
                var existingUser = await _context.Users
                    .AnyAsync(u => u.Username == createUserDto.Username || u.Email == createUserDto.Email);

                if (existingUser)
                {
                    return Conflict(ApiResponse<UserDto>.FailureResult("Username or email already exists"));
                }

                
                string hashedPassword = HashPassword(createUserDto.Password);                var user = new User
                {
                    FirstName = createUserDto.FirstName,
                    LastName = createUserDto.LastName,
                    Email = createUserDto.Email,
                    Phone = createUserDto.Phone,
                    Username = createUserDto.Username,
                    PasswordHash = hashedPassword,
                    RoleId = createUserDto.RoleId,
                    CreatedDate = DateTime.UtcNow,
                    IsActive = true
                };                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                
                var createdUser = await _context.Users
                    .Include(u => u.Role)
                    .FirstOrDefaultAsync(u => u.UserId == user.UserId);

                var userDto = new UserDto
                {
                    UserId = createdUser.UserId,
                    FirstName = createdUser.FirstName,
                    LastName = createdUser.LastName,
                    Email = createdUser.Email,
                    Phone = createdUser.Phone,
                    Username = createdUser.Username,
                    RoleId = createdUser.RoleId,
                    Role = createdUser.Role != null ? createdUser.Role.RoleName : "Employee", 
                    CreatedDate = createdUser.CreatedDate,
                    UpdatedDate = createdUser.UpdatedDate,
                    IsActive = createdUser.IsActive
                };

                return CreatedAtAction(nameof(GetUser), new { id = user.UserId },
                    ApiResponse<UserDto>.SuccessResult(userDto, "User created successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<UserDto>.FailureResult("An error occurred while creating the user", new List<string> { ex.Message }));
            }
        }

        
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<UserDto>>> UpdateUser(int id, UpdateUserDto updateUserDto)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound(ApiResponse<UserDto>.FailureResult("User not found"));
                }                
                var existingUser = await _context.Users
                    .AnyAsync(u => u.UserId != id && (u.Username == updateUserDto.Username || u.Email == updateUserDto.Email));

                if (existingUser)
                {
                    return Conflict(ApiResponse<UserDto>.FailureResult("Username or email already exists"));
                }

                
                if (updateUserDto.RoleId > 0)
                {
                    var roleExists = await _context.Roles.AnyAsync(r => r.RoleId == updateUserDto.RoleId);
                    if (!roleExists)
                    {
                        return BadRequest(ApiResponse<UserDto>.FailureResult("Invalid role selected"));
                    }
                }

                user.FirstName = updateUserDto.FirstName;
                user.LastName = updateUserDto.LastName;
                user.Email = updateUserDto.Email;
                user.Phone = updateUserDto.Phone;
                user.Username = updateUserDto.Username;
                user.RoleId = updateUserDto.RoleId;
                user.IsActive = updateUserDto.IsActive;
                user.UpdatedDate = DateTime.UtcNow;                await _context.SaveChangesAsync();

                
                var updatedUser = await _context.Users
                    .Include(u => u.Role)
                    .FirstOrDefaultAsync(u => u.UserId == user.UserId);

                var userDto = new UserDto
                {
                    UserId = updatedUser.UserId,
                    FirstName = updatedUser.FirstName,
                    LastName = updatedUser.LastName,
                    Email = updatedUser.Email,
                    Phone = updatedUser.Phone,
                    Username = updatedUser.Username,
                    RoleId = updatedUser.RoleId,
                    Role = updatedUser.Role != null ? updatedUser.Role.RoleName : "Employee", 
                    CreatedDate = updatedUser.CreatedDate,
                    UpdatedDate = updatedUser.UpdatedDate,
                    IsActive = updatedUser.IsActive
                };

                return Ok(ApiResponse<UserDto>.SuccessResult(userDto, "User updated successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<UserDto>.FailureResult("An error occurred while updating the user", new List<string> { ex.Message }));
            }
        }

        
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteUser(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound(ApiResponse<object>.FailureResult("User not found"));
                }

                
                user.IsActive = false;
                user.UpdatedDate = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(ApiResponse<object>.SuccessResult(null, "User deleted successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<object>.FailureResult("An error occurred while deleting the user", new List<string> { ex.Message }));
            }
        }

        private static string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }
    }
}
