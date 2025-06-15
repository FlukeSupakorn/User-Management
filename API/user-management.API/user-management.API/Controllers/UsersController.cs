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
                        RoleId = u.RoleId.ToString(),
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

        
        [HttpPost("DataTable")]
        public async Task<ActionResult<ApiResponse<UserDataTableResponseDto>>> GetUsersDataTable(UserDataTableRequestDto request)
        {
            try
            {
                var query = _context.Users
                    .Include(u => u.Role)
                    .Include(u => u.ModulePermissions)
                    .AsQueryable();

                // Apply search filter
                if (!string.IsNullOrWhiteSpace(request.SearchTerm))
                {
                    var searchTerm = request.SearchTerm.ToLower();
                    query = query.Where(u => 
                        u.FirstName.ToLower().Contains(searchTerm) ||
                        u.LastName.ToLower().Contains(searchTerm) ||
                        u.Email.ToLower().Contains(searchTerm) ||
                        u.Username.ToLower().Contains(searchTerm) ||
                        (u.Role != null && u.Role.RoleName.ToLower().Contains(searchTerm))
                    );
                }

                // Apply sorting
                switch (request.SortBy.ToLower())
                {
                    case "firstname":
                        query = request.SortDirection.ToLower() == "desc" 
                            ? query.OrderByDescending(u => u.FirstName)
                            : query.OrderBy(u => u.FirstName);
                        break;
                    case "lastname":
                        query = request.SortDirection.ToLower() == "desc" 
                            ? query.OrderByDescending(u => u.LastName)
                            : query.OrderBy(u => u.LastName);
                        break;
                    case "email":
                        query = request.SortDirection.ToLower() == "desc" 
                            ? query.OrderByDescending(u => u.Email)
                            : query.OrderBy(u => u.Email);
                        break;
                    case "createddate":
                        query = request.SortDirection.ToLower() == "desc" 
                            ? query.OrderByDescending(u => u.CreatedDate)
                            : query.OrderBy(u => u.CreatedDate);
                        break;
                    case "role":
                        query = request.SortDirection.ToLower() == "desc" 
                            ? query.OrderByDescending(u => u.Role != null ? u.Role.RoleName : "")
                            : query.OrderBy(u => u.Role != null ? u.Role.RoleName : "");
                        break;
                    default:
                        query = query.OrderBy(u => u.FirstName);
                        break;
                }

                // Get total count before pagination
                var totalRecords = await query.CountAsync();

                // Apply pagination
                var skip = (request.PageNumber - 1) * request.PageSize;
                var users = await query
                    .Skip(skip)
                    .Take(request.PageSize)
                    .Select(u => new UserDto
                    {
                        UserId = u.UserId,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        Email = u.Email,
                        Phone = u.Phone ?? string.Empty,
                        Username = u.Username,
                        RoleId = u.RoleId.ToString(),
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

                var totalPages = (int)Math.Ceiling((double)totalRecords / request.PageSize);

                var response = new UserDataTableResponseDto
                {
                    Data = users,
                    TotalRecords = totalRecords,
                    PageNumber = request.PageNumber,
                    PageSize = request.PageSize,
                    TotalPages = totalPages
                };

                return Ok(ApiResponse<UserDataTableResponseDto>.SuccessResult(response, "Users retrieved successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<UserDataTableResponseDto>.FailureResult("An error occurred while retrieving users", new List<string> { ex.Message }));
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<UserDto>>> GetUser(string id)
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
                        RoleId = u.RoleId.ToString(),
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
        if (string.IsNullOrWhiteSpace(createUserDto.UserId) ||
            string.IsNullOrWhiteSpace(createUserDto.FirstName) ||
            string.IsNullOrWhiteSpace(createUserDto.LastName) ||
            string.IsNullOrWhiteSpace(createUserDto.Email) ||
            string.IsNullOrWhiteSpace(createUserDto.Username) ||
            string.IsNullOrWhiteSpace(createUserDto.Password) ||
            string.IsNullOrWhiteSpace(createUserDto.RoleId))
        {
            return BadRequest(ApiResponse<UserDto>.FailureResult("All required fields must be provided"));
        }

        // Check if UserId already exists
        var existingUserWithId = await _context.Users.AnyAsync(u => u.UserId == createUserDto.UserId);
        if (existingUserWithId)
        {
            return Conflict(ApiResponse<UserDto>.FailureResult("User ID already exists"));
        }

        // Normalize username and email for comparison
        var normalizedUsername = createUserDto.Username.Trim().ToLower();
        var normalizedEmail = createUserDto.Email.Trim().ToLower();


        // Parse and validate RoleId
        if (!int.TryParse(createUserDto.RoleId, out int roleId) || roleId <= 0)
        {
            return BadRequest(ApiResponse<UserDto>.FailureResult("Invalid role ID"));
        }

        // Fetch the role
        var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleId == roleId);
        if (role == null)
        {
            return BadRequest(ApiResponse<UserDto>.FailureResult("Invalid role selected"));
        }

        // Hash password
        string hashedPassword = HashPassword(createUserDto.Password);

        // Create user
        var user = new User
        {
            UserId = createUserDto.UserId,
            FirstName = createUserDto.FirstName.Trim(),
            LastName = createUserDto.LastName.Trim(),
            Email = createUserDto.Email.Trim(),
            Phone = createUserDto.Phone?.Trim(),
            Username = createUserDto.Username.Trim(),
            PasswordHash = hashedPassword,
            RoleId = roleId,
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
            UserId = createdUser!.UserId,
            FirstName = createdUser.FirstName,
            LastName = createdUser.LastName,
            Email = createdUser.Email,
            Phone = createdUser.Phone ?? string.Empty,
            Username = createdUser.Username,
            RoleId = createdUser.RoleId.ToString(),
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
        public async Task<ActionResult<ApiResponse<UserDto>>> UpdateUser(string id, UpdateUserDto updateUserDto)
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

                
                if (!string.IsNullOrWhiteSpace(updateUserDto.RoleId))
                {
                    if (!int.TryParse(updateUserDto.RoleId, out int roleId) || roleId <= 0)
                    {
                        return BadRequest(ApiResponse<UserDto>.FailureResult("Invalid role ID"));
                    }
                    
                    var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleId == roleId);
                    if (role == null)
                    {
                        return BadRequest(ApiResponse<UserDto>.FailureResult("Invalid role selected"));
                    }
                    user.RoleId = roleId;
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
                    UserId = updatedUser!.UserId,
                    FirstName = updatedUser.FirstName,
                    LastName = updatedUser.LastName,
                    Email = updatedUser.Email,
                    Phone = updatedUser.Phone ?? string.Empty,
                    Username = updatedUser.Username,
                    RoleId = updatedUser.RoleId.ToString(),
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
    public async Task<ActionResult<ApiResponse<object>>> DeleteUser(string id)
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
            return Ok(ApiResponse<object>.SuccessResult(new object(), "User deleted successfully"));
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
