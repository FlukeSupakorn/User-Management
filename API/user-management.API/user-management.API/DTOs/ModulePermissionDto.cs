namespace user_management.API.DTOs
{
    public class ModulePermissionDto
    {
        public int PermissionId { get; set; }
        public string ModuleName { get; set; } = string.Empty;
        public bool CanRead { get; set; }
        public bool CanWrite { get; set; }
        public bool CanDelete { get; set; }
    }

    public class CreateModulePermissionDto
    {
        public string ModuleName { get; set; } = string.Empty;
        public int UserId { get; set; }
        public bool CanRead { get; set; }
        public bool CanWrite { get; set; }
        public bool CanDelete { get; set; }
    }

    public class UpdateModulePermissionDto
    {
        public bool CanRead { get; set; }
        public bool CanWrite { get; set; }
        public bool CanDelete { get; set; }
    }

    public class UserPermissionDto
    {
        public string PermissionId { get; set; } = string.Empty;
        public string ModuleName { get; set; } = string.Empty;
        public bool IsReadable { get; set; }
        public bool IsWritable { get; set; }
        public bool IsDeletable { get; set; }
    }
}