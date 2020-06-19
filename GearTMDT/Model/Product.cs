using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GearTMDT.Model
{
    public class Product
    {
        public long Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Image { get; set; }
        public string SubImage { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public long Price { get; set; }
        [Required]
        public int Discount { get; set; }
        public long PriceDiscount { get; set; }
        public long CatalogID { get; set; }
        [ForeignKey("CatalogID")]
        public virtual Catalog Catalog { get; set; }
        public long ProducerID { get; set; }
        [ForeignKey("ProducerID")]
        public virtual Producer Producer { get; set; }
        [Required]
        public int Stock { get; set; }
        public string Slug { get; set; }


        
    }
}