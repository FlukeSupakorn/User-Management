using System.Collections.Generic;

namespace user_management.API.DTOs
{    public class UserDto
    {
        public string UserId { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string RoleId { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty; // Add role name
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public List<UserPermissionDto> Permissions { get; set; } = new List<UserPermissionDto>();
    }
    
    public class CreateUserDto
    {
        public string UserId { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string RoleId { get; set; } = string.Empty;
        public List<UserPermissionDto> Permissions { get; set; } = new List<UserPermissionDto>();
    }
    
    public class UpdateUserDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string RoleId { get; set; } = string.Empty;
        public List<UserPermissionDto> Permissions { get; set; } = new List<UserPermissionDto>();
    }

    public class UserDataTableRequestDto
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string SearchTerm { get; set; } = string.Empty;
        public string SortBy { get; set; } = "firstName";
        public string SortDirection { get; set; } = "asc";
    }

    public class UserDataTableResponseDto
    {
        public List<UserDto> Data { get; set; } = new List<UserDto>();
        public int TotalRecords { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }
}
