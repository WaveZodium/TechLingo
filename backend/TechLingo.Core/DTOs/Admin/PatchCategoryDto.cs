namespace TechLingo.Core.DTOs.Admin
{
    public class PatchCategoryDto
    {
        public string? Name { get; set; }
        public string? Slug { get; set; }
        public string? Description { get; set; }
        public bool? IsActive { get; set; }
    }
}
