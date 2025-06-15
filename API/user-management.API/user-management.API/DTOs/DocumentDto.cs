using System;
using System.Collections.Generic;

namespace user_management.API.DTOs
{
    public class DocumentDto
    {
        public int DocumentId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime Date { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }

    public class CreateDocumentDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime Date { get; set; }
    }

    public class UpdateDocumentDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime Date { get; set; }
    }

    public class DocumentDataTableRequestDto
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string SearchTerm { get; set; } = string.Empty;
        public string SortBy { get; set; } = "date";
        public string SortDirection { get; set; } = "desc";
    }

    public class DocumentDataTableResponseDto
    {
        public List<DocumentDto> Data { get; set; } = new List<DocumentDto>();
        public int TotalRecords { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }
}