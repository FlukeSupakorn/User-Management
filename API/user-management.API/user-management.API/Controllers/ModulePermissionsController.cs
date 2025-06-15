using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using user_management.API.Data;
using user_management.API.DTOs;
using user_management.API.Models;

namespace user_management.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ModulePermissionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ModulePermissionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<ModulePermissionDto>>>> GetModulePermissions()
        {
            try
            {
                var permissions = await _context.ModulePermissions
                    .Select(p => new ModulePermissionDto
                    {
                        PermissionId = p.PermissionId,
                        ModuleName = p.ModuleName,
                        CanRead = p.CanRead,
                        CanWrite = p.CanWrite,
                        CanDelete = p.CanDelete
                    })
                    .ToListAsync();

                return Ok(ApiResponse<List<ModulePermissionDto>>.SuccessResult(permissions, "Module permissions retrieved successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<ModulePermissionDto>>.FailureResult("An error occurred while retrieving module permissions", new List<string> { ex.Message }));
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<ModulePermissionDto>>> GetModulePermission(int id)
        {
            try
            {
                var permission = await _context.ModulePermissions
                    .Where(p => p.PermissionId == id)
                    .Select(p => new ModulePermissionDto
                    {
                        PermissionId = p.PermissionId,
                        ModuleName = p.ModuleName,
                        CanRead = p.CanRead,
                        CanWrite = p.CanWrite,
                        CanDelete = p.CanDelete
                    })
                    .FirstOrDefaultAsync();

                if (permission == null)
                {
                    return NotFound(ApiResponse<ModulePermissionDto>.FailureResult("Module permission not found"));
                }

                return Ok(ApiResponse<ModulePermissionDto>.SuccessResult(permission, "Module permission retrieved successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<ModulePermissionDto>.FailureResult("An error occurred while retrieving the module permission", new List<string> { ex.Message }));
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<ApiResponse<List<ModulePermissionDto>>>> GetUserModulePermissions(string userId)
        {
            try
            {
                var permissions = await _context.ModulePermissions
                    .Where(p => p.UserId == userId)
                    .Select(p => new ModulePermissionDto
                    {
                        PermissionId = p.PermissionId,
                        ModuleName = p.ModuleName,
                        CanRead = p.CanRead,
                        CanWrite = p.CanWrite,
                        CanDelete = p.CanDelete
                    })
                    .ToListAsync();

                return Ok(ApiResponse<List<ModulePermissionDto>>.SuccessResult(permissions, $"Module permissions for user {userId} retrieved successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<ModulePermissionDto>>.FailureResult("An error occurred while retrieving user module permissions", new List<string> { ex.Message }));
            }
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<ModulePermissionDto>>> CreateModulePermission(CreateModulePermissionDto createDto)
        {
            try
            {
                // Validate user exists
                var user = await _context.Users.FindAsync(createDto.UserId);
                if (user == null)
                {
                    return BadRequest(ApiResponse<ModulePermissionDto>.FailureResult("Invalid user ID"));
                }

                // Check if permission already exists for this user and module
                var existingPermission = await _context.ModulePermissions
                    .AnyAsync(p => p.UserId == createDto.UserId && p.ModuleName == createDto.ModuleName);

                if (existingPermission)
                {
                    return Conflict(ApiResponse<ModulePermissionDto>.FailureResult("Permission already exists for this user and module"));
                }

                var permission = new ModulePermission
                {
                    UserId = createDto.UserId,
                    ModuleName = createDto.ModuleName,
                    CanRead = createDto.CanRead,
                    CanWrite = createDto.CanWrite,
                    CanDelete = createDto.CanDelete,
                    User = user
                };

                _context.ModulePermissions.Add(permission);
                await _context.SaveChangesAsync();

                var permissionDto = new ModulePermissionDto
                {
                    PermissionId = permission.PermissionId,
                    ModuleName = permission.ModuleName,
                    CanRead = permission.CanRead,
                    CanWrite = permission.CanWrite,
                    CanDelete = permission.CanDelete
                };

                return CreatedAtAction(nameof(GetModulePermission), new { id = permission.PermissionId },
                    ApiResponse<ModulePermissionDto>.SuccessResult(permissionDto, "Module permission created successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<ModulePermissionDto>.FailureResult("An error occurred while creating the module permission", new List<string> { ex.Message }));
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<ModulePermissionDto>>> UpdateModulePermission(int id, UpdateModulePermissionDto updateDto)
        {
            try
            {
                var permission = await _context.ModulePermissions.FindAsync(id);
                if (permission == null)
                {
                    return NotFound(ApiResponse<ModulePermissionDto>.FailureResult("Module permission not found"));
                }

                permission.CanRead = updateDto.CanRead;
                permission.CanWrite = updateDto.CanWrite;
                permission.CanDelete = updateDto.CanDelete;

                await _context.SaveChangesAsync();

                var permissionDto = new ModulePermissionDto
                {
                    PermissionId = permission.PermissionId,
                    ModuleName = permission.ModuleName,
                    CanRead = permission.CanRead,
                    CanWrite = permission.CanWrite,
                    CanDelete = permission.CanDelete
                };

                return Ok(ApiResponse<ModulePermissionDto>.SuccessResult(permissionDto, "Module permission updated successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<ModulePermissionDto>.FailureResult("An error occurred while updating the module permission", new List<string> { ex.Message }));
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteModulePermission(int id)
        {
            try
            {
                var permission = await _context.ModulePermissions.FindAsync(id);
                if (permission == null)
                {
                    return NotFound(ApiResponse<object>.FailureResult("Module permission not found"));
                }

                _context.ModulePermissions.Remove(permission);
                await _context.SaveChangesAsync();

                return Ok(ApiResponse<object>.SuccessResult(new object(), "Module permission deleted successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<object>.FailureResult("An error occurred while deleting the module permission", new List<string> { ex.Message }));
            }
        }

        [HttpDelete("user/{userId}")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteUserModulePermissions(string userId)
        {
            try
            {
                var permissions = await _context.ModulePermissions
                    .Where(p => p.UserId == userId)
                    .ToListAsync();

                if (!permissions.Any())
                {
                    return NotFound(ApiResponse<object>.FailureResult($"No module permissions found for user {userId}"));
                }

                _context.ModulePermissions.RemoveRange(permissions);
                await _context.SaveChangesAsync();

                return Ok(ApiResponse<object>.SuccessResult(new object(), $"All module permissions for user {userId} deleted successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<object>.FailureResult("An error occurred while deleting user module permissions", new List<string> { ex.Message }));
            }
        }
    }
}