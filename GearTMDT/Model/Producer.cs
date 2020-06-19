
using System.ComponentModel.DataAnnotations;

namespace GearTMDT.Model
{
    public class Producer
    {
        public long Id { get; set; }
        [Required]
        public string Name {get; set;}
        public string Description {get; set;}

    }
}