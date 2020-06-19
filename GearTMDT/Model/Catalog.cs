using System.ComponentModel.DataAnnotations;

namespace GearTMDT.Model
{
    public class Catalog
    {
        [Key]
        public long Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
    }
}