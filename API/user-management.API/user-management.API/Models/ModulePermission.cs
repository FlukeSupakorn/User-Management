using System.ComponentModel.DataAnnotations;

namespace user_management.API.Models
{
    public class ModulePermission
    {
        [Key]
        public int PermissionId { get; set; }

        [Required]
        [StringLength(100)]
        public string ModuleName { get; set; } = string.Empty;

        public string UserId { get; set; } = string.Empty;

        public bool CanRead { get; set; }

        public bool CanWrite { get; set; }

        public bool CanDelete { get; set; }

        public required User User { get; set; }
    }
}