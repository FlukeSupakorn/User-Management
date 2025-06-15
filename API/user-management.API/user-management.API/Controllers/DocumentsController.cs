using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using user_management.API.Data;
using user_management.API.DTOs;
using user_management.API.Models;

namespace user_management.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DocumentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/documents
        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<DocumentDto>>>> GetDocuments()
        {
            try
            {
                var documents = await _context.Documents
                    .OrderByDescending(d => d.Date)
                    .Select(d => new DocumentDto
                    {
                        DocumentId = d.DocumentId,
                        Title = d.Title,
                        Description = d.Description,
                        Date = d.Date,
                        CreatedDate = d.CreatedDate,
                        UpdatedDate = d.UpdatedDate
                    })
                    .ToListAsync();

                return Ok(ApiResponse<List<DocumentDto>>.SuccessResult(documents, "Documents retrieved successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<DocumentDto>>.FailureResult($"An error occurred: {ex.Message}"));
            }
        }

        // GET: api/documents/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<DocumentDto>>> GetDocument(int id)
        {
            try
            {
                var document = await _context.Documents
                    .Where(d => d.DocumentId == id)
                    .Select(d => new DocumentDto
                    {
                        DocumentId = d.DocumentId,
                        Title = d.Title,
                        Description = d.Description,
                        Date = d.Date,
                        CreatedDate = d.CreatedDate,
                        UpdatedDate = d.UpdatedDate
                    })
                    .FirstOrDefaultAsync();

                if (document == null)
                {
                    return NotFound(ApiResponse<DocumentDto>.FailureResult("Document not found"));
                }

                return Ok(ApiResponse<DocumentDto>.SuccessResult(document, "Document retrieved successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<DocumentDto>.FailureResult($"An error occurred: {ex.Message}"));
            }
        }

        // POST: api/documents
        [HttpPost]
        public async Task<ActionResult<ApiResponse<DocumentDto>>> CreateDocument([FromBody] CreateDocumentDto createDocumentDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ApiResponse<DocumentDto>.FailureResult("Invalid document data"));
                }

                var document = new Document
                {
                    Title = createDocumentDto.Title,
                    Description = createDocumentDto.Description,
                    Date = createDocumentDto.Date,
                    CreatedDate = DateTime.UtcNow
                };

                _context.Documents.Add(document);
                await _context.SaveChangesAsync();

                var documentDto = new DocumentDto
                {
                    DocumentId = document.DocumentId,
                    Title = document.Title,
                    Description = document.Description,
                    Date = document.Date,
                    CreatedDate = document.CreatedDate,
                    UpdatedDate = document.UpdatedDate
                };

                return CreatedAtAction(nameof(GetDocument), new { id = document.DocumentId }, 
                    ApiResponse<DocumentDto>.SuccessResult(documentDto, "Document created successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<DocumentDto>.FailureResult($"An error occurred: {ex.Message}"));
            }
        }

        // PUT: api/documents/5
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<DocumentDto>>> UpdateDocument(int id, [FromBody] UpdateDocumentDto updateDocumentDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ApiResponse<DocumentDto>.FailureResult("Invalid document data"));
                }

                var document = await _context.Documents.FindAsync(id);
                if (document == null)
                {
                    return NotFound(ApiResponse<DocumentDto>.FailureResult("Document not found"));
                }

                document.Title = updateDocumentDto.Title;
                document.Description = updateDocumentDto.Description;
                document.Date = updateDocumentDto.Date;
                document.UpdatedDate = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                var documentDto = new DocumentDto
                {
                    DocumentId = document.DocumentId,
                    Title = document.Title,
                    Description = document.Description,
                    Date = document.Date,
                    CreatedDate = document.CreatedDate,
                    UpdatedDate = document.UpdatedDate
                };

                return Ok(ApiResponse<DocumentDto>.SuccessResult(documentDto, "Document updated successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<DocumentDto>.FailureResult($"An error occurred: {ex.Message}"));
            }
        }

        // DELETE: api/documents/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteDocument(int id)
        {
            try
            {
                var document = await _context.Documents.FindAsync(id);
                if (document == null)
                {
                    return NotFound(ApiResponse<bool>.FailureResult("Document not found"));
                }

                _context.Documents.Remove(document);
                await _context.SaveChangesAsync();

                return Ok(ApiResponse<bool>.SuccessResult(true, "Document deleted successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<bool>.FailureResult($"An error occurred: {ex.Message}"));
            }
        }
    }
}