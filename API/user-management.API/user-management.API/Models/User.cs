using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace user_management.API.Models
{
    public class User
    {
        [Key]
        public string UserId { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;

        [StringLength(20)]
        public string? Phone { get; set; }

        [Required]
        [StringLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string PasswordHash { get; set; } = string.Empty;

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedDate { get; set; }
        
        public int RoleId { get; set; }
        public required Role Role { get; set; }
        
        public ICollection<ModulePermission> ModulePermissions { get; set; } = new List<ModulePermission>();
    }
}
