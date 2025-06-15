using System.ComponentModel.DataAnnotations;

namespace user_management.API.Models
{
    public class Document
    {
        [Key]
        public int DocumentId { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        [Required]
        public DateTime Date { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime? UpdatedDate { get; set; }
    }
}