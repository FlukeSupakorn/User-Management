using System;
using System.ComponentModel.DataAnnotations;

namespace user_management.API.Models
{
    public class UserPermission
    {
        public int UserId { get; set; }
        public int PermissionId { get; set; }

        public bool IsReadable { get; set; } = false;
        public bool IsWritable { get; set; } = false;
        public bool IsDeletable { get; set; } = false;
        public DateTime AssignedDate { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;

        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual Permission Permission { get; set; } = null!;
    }
}
