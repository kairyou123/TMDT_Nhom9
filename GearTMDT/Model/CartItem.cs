using Microsoft.AspNetCore.Session;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace GearTMDT.Model
{
    public class CartItem
    {
        [Key]
        public long Id { get; set; }
        [Required]
        public string UserId { get; set; }
        [Required]
        public long ProductId { get; set; }
        public virtual Product Product { get; set; }
        [Required]
        public int Quantity { get; set; }
    }
}
