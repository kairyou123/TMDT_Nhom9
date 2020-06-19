using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace GearTMDT.Model
{
    public class OrderItem
    {
        [Key]
        public long Id { get; set; }
        [Required]
        public long OrderId {get;set;}
        [JsonIgnore]
        public virtual Order Order { get; set; }
        [Required]
        public long ProductId {get;set;}
        public virtual Product Product { get; set; }
        [Required]
        public int Quantity { get; set; }
    }
}
