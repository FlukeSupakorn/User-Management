using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using user_management.API.Data;
using user_management.API.DTOs;
using user_management.API.Models;

namespace user_management.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RolesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RolesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Roles
        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<RoleDto>>>> GetRoles()
        {
            try
            {
                var roles = await _context.Roles
                    .Select(r => new RoleDto
                    {
                        RoleId = r.RoleId,
                        RoleName = r.RoleName,
                        Description = r.Description,
                        CreatedDate = r.CreatedDate,
                    })
                    .ToListAsync();

                return Ok(ApiResponse<List<RoleDto>>.SuccessResult(roles, "Roles retrieved successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<RoleDto>>.FailureResult("An error occurred while retrieving roles", new List<string> { ex.Message }));
            }
        }

        // GET: api/Roles/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<RoleDto>>> GetRole(int id)
        {
            try
            {
                var role = await _context.Roles
                    .Where(r => r.RoleId == id)
                    .Select(r => new RoleDto
                    {
                        RoleId = r.RoleId,
                        RoleName = r.RoleName,
                        Description = r.Description,
                        CreatedDate = r.CreatedDate,
                    })
                    .FirstOrDefaultAsync();

                if (role == null)
                {
                    return NotFound(ApiResponse<RoleDto>.FailureResult("Role not found"));
                }

                return Ok(ApiResponse<RoleDto>.SuccessResult(role, "Role retrieved successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<RoleDto>.FailureResult("An error occurred while retrieving the role", new List<string> { ex.Message }));
            }
        }

        // POST: api/Roles
        [HttpPost]
        public async Task<ActionResult<ApiResponse<RoleDto>>> CreateRole(CreateRoleDto createRoleDto)
        {
            try
            {
                // Validate required fields
                if (string.IsNullOrWhiteSpace(createRoleDto.RoleName))
                {
                    return BadRequest(ApiResponse<RoleDto>.FailureResult("Role name is required"));
                }

                // Check if role name already exists
                var existingRole = await _context.Roles
                    .AnyAsync(r => r.RoleName == createRoleDto.RoleName);

                if (existingRole)
                {
                    return Conflict(ApiResponse<RoleDto>.FailureResult("Role name already exists"));
                }

                var role = new Role
                {
                    RoleName = createRoleDto.RoleName,
                    Description = createRoleDto.Description,
                    CreatedDate = DateTime.UtcNow,
                };

                _context.Roles.Add(role);
                await _context.SaveChangesAsync();

                var roleDto = new RoleDto
                {
                    RoleId = role.RoleId,
                    RoleName = role.RoleName,
                    Description = role.Description,
                    CreatedDate = role.CreatedDate,
                };

                return CreatedAtAction(nameof(GetRole), new { id = role.RoleId }, 
                    ApiResponse<RoleDto>.SuccessResult(roleDto, "Role created successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<RoleDto>.FailureResult("An error occurred while creating the role", new List<string> { ex.Message }));
            }
        }

        // PUT: api/Roles/5
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<RoleDto>>> UpdateRole(int id, UpdateRoleDto updateRoleDto)
        {
            try
            {
                var role = await _context.Roles.FindAsync(id);
                if (role == null)
                {
                    return NotFound(ApiResponse<RoleDto>.FailureResult("Role not found"));
                }

                // Check if role name already exists for other roles
                var existingRole = await _context.Roles
                    .AnyAsync(r => r.RoleId != id && r.RoleName == updateRoleDto.RoleName);

                if (existingRole)
                {
                    return Conflict(ApiResponse<RoleDto>.FailureResult("Role name already exists"));
                }

                role.RoleName = updateRoleDto.RoleName;
                role.Description = updateRoleDto.Description;

                await _context.SaveChangesAsync();

                var roleDto = new RoleDto
                {
                    RoleId = role.RoleId,
                    RoleName = role.RoleName,
                    Description = role.Description,
                    CreatedDate = role.CreatedDate,
                };

                return Ok(ApiResponse<RoleDto>.SuccessResult(roleDto, "Role updated successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<RoleDto>.FailureResult("An error occurred while updating the role", new List<string> { ex.Message }));
            }
        }

        // DELETE: api/Roles/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteRole(int id)
        {
            try
            {
                var role = await _context.Roles.FindAsync(id);
                if (role == null)
                {
                    return NotFound(ApiResponse<object>.FailureResult("Role not found"));
                }                // Check if role is assigned to any users
                var roleInUse = await _context.Users.AnyAsync(u => u.RoleId == id);
                if (roleInUse)
                {
                    return BadRequest(ApiResponse<object>.FailureResult("Cannot delete role that is assigned to users"));
                }

       

                await _context.SaveChangesAsync();

                return Ok(ApiResponse<object>.SuccessResult(null, "Role deleted successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<object>.FailureResult("An error occurred while deleting the role", new List<string> { ex.Message }));
            }
        }
    }
}
