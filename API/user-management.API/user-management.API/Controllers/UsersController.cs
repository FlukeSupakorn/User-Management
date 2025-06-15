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
            {
                var users = await _context.Users
                    .Include(u => u.Role)
                    .Include(u => u.ModulePermissions)
                    .Select(u => new UserDto
                    {
                        UserId = u.UserId,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        Email = u.Email,
                        Phone = u.Phone ?? string.Empty,
                        Username = u.Username,
                        RoleId = u.RoleId,
                        Role = u.Role != null ? u.Role.RoleName : "Employee", 
                        CreatedDate = u.CreatedDate,
                        UpdatedDate = u.UpdatedDate,
                        Permissions = u.ModulePermissions != null ? u.ModulePermissions.Select(p => new UserPermissionDto
                        {
                            PermissionId = p.PermissionId.ToString(),
                            ModuleName = p.ModuleName,
                            IsReadable = p.CanRead,
                            IsWritable = p.CanWrite,
                            IsDeletable = p.CanDelete
                        }).ToList() : new List<UserPermissionDto>()
                    })
                    .ToListAsync();

                return Ok(ApiResponse<List<UserDto>>.SuccessResult(users, "Users retrieved successfully"));
            }
            catch (Exception ex)
            {
                // Log the full exception details
                var errorDetails = new List<string> 
                { 
                    ex.Message,
                    ex.InnerException?.Message ?? "No inner exception",
                    ex.StackTrace ?? "No stack trace"
                };
                
                return StatusCode(500, ApiResponse<List<UserDto>>.FailureResult($"An error occurred while retrieving users: {ex.Message}", errorDetails));
            }
        }

        
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<UserDto>>> GetUser(int id)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.Role)
                    .Include(u => u.ModulePermissions)
                    .Where(u => u.UserId == id)
                    .Select(u => new UserDto
                    {
                        UserId = u.UserId,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        Email = u.Email,
                        Phone = u.Phone ?? string.Empty,
                        Username = u.Username,
                        RoleId = u.RoleId,
                        Role = u.Role != null ? u.Role.RoleName : "Employee", 
                        CreatedDate = u.CreatedDate,
                        UpdatedDate = u.UpdatedDate,
                        Permissions = u.ModulePermissions != null ? u.ModulePermissions.Select(p => new UserPermissionDto
                        {
                            PermissionId = p.PermissionId.ToString(),
                            ModuleName = p.ModuleName,
                            IsReadable = p.CanRead,
                            IsWritable = p.CanWrite,
                            IsDeletable = p.CanDelete
                        }).ToList() : new List<UserPermissionDto>()
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
        // Validate required fields
        if (string.IsNullOrWhiteSpace(createUserDto.FirstName) ||
            string.IsNullOrWhiteSpace(createUserDto.LastName) ||
            string.IsNullOrWhiteSpace(createUserDto.Email) ||
            string.IsNullOrWhiteSpace(createUserDto.Username) ||
            string.IsNullOrWhiteSpace(createUserDto.Password) ||
            createUserDto.RoleId <= 0)
        {
            return BadRequest(ApiResponse<UserDto>.FailureResult("All required fields must be provided"));
        }

        // Normalize username and email for comparison
        var normalizedUsername = createUserDto.Username.Trim().ToLower();
        var normalizedEmail = createUserDto.Email.Trim().ToLower();


        // Fetch the role
        var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleId == createUserDto.RoleId);
        if (role == null)
        {
            return BadRequest(ApiResponse<UserDto>.FailureResult("Invalid role selected"));
        }

        // Hash password
        string hashedPassword = HashPassword(createUserDto.Password);

        // Create user
        var user = new User
        {
            FirstName = createUserDto.FirstName.Trim(),
            LastName = createUserDto.LastName.Trim(),
            Email = createUserDto.Email.Trim(),
            Phone = createUserDto.Phone?.Trim(),
            Username = createUserDto.Username.Trim(),
            PasswordHash = hashedPassword,
            RoleId = createUserDto.RoleId,
            Role = role,
            CreatedDate = DateTime.UtcNow,
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Create permissions if provided
        if (createUserDto.Permissions != null && createUserDto.Permissions.Any())
        {
            foreach (var permDto in createUserDto.Permissions)
            {
                var permission = new ModulePermission
                {
                    UserId = user.UserId,
                    ModuleName = permDto.ModuleName,
                    CanRead = permDto.IsReadable,
                    CanWrite = permDto.IsWritable,
                    CanDelete = permDto.IsDeletable,
                    User = user
                };
                _context.ModulePermissions.Add(permission);
            }
            await _context.SaveChangesAsync();
        }

        // Fetch created user with role and permissions
        var createdUser = await _context.Users
            .Include(u => u.Role)
            .Include(u => u.ModulePermissions)
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
            Permissions = createdUser.ModulePermissions.Select(p => new UserPermissionDto
            {
                PermissionId = p.PermissionId.ToString(),
                ModuleName = p.ModuleName,
                IsReadable = p.CanRead,
                IsWritable = p.CanWrite,
                IsDeletable = p.CanDelete
            }).ToList()
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
                    var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleId == updateUserDto.RoleId);
                    if (role == null)
                    {
                        return BadRequest(ApiResponse<UserDto>.FailureResult("Invalid role selected"));
                    }
                    user.RoleId = updateUserDto.RoleId;
                    user.Role = role;
                }

                user.FirstName = updateUserDto.FirstName;
                user.LastName = updateUserDto.LastName;
                user.Email = updateUserDto.Email;
                user.Phone = updateUserDto.Phone;
                user.Username = updateUserDto.Username;
                // RoleId and Role are now set in the role validation block above
                user.UpdatedDate = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                // Update permissions if provided
                if (updateUserDto.Permissions != null)
                {
                    // Remove existing permissions
                    var existingPermissions = await _context.ModulePermissions
                        .Where(p => p.UserId == id)
                        .ToListAsync();
                    _context.ModulePermissions.RemoveRange(existingPermissions);

                    // Add new permissions
                    foreach (var permDto in updateUserDto.Permissions)
                    {
                        var permission = new ModulePermission
                        {
                            UserId = id,
                            ModuleName = permDto.ModuleName,
                            CanRead = permDto.IsReadable,
                            CanWrite = permDto.IsWritable,
                            CanDelete = permDto.IsDeletable,
                            User = user
                        };
                        _context.ModulePermissions.Add(permission);
                    }
                    await _context.SaveChangesAsync();
                }

                
                var updatedUser = await _context.Users
                    .Include(u => u.Role)
                    .Include(u => u.ModulePermissions)
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
                    Permissions = updatedUser.ModulePermissions.Select(p => new UserPermissionDto
                    {
                        PermissionId = p.PermissionId.ToString(),
                        ModuleName = p.ModuleName,
                        IsReadable = p.CanRead,
                        IsWritable = p.CanWrite,
                        IsDeletable = p.CanDelete
                    }).ToList()
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
        // 1) find the user
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound(ApiResponse<object>.FailureResult("User not found"));

        // 2) remove and save
        _context.Users.Remove(user);
        var rows = await _context.SaveChangesAsync();

        // 3) confirm how many rows were affected (should be 1)
        if (rows > 0)
            return Ok(ApiResponse<object>.SuccessResult(null, "User deleted successfully"));
        else
            return StatusCode(500, ApiResponse<object>.FailureResult("Delete did not persist"));
    }

        private static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }
    }
}
