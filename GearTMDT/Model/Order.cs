using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace GearTMDT.Model
{
    public class Order
    {
        [Key]
        public long Id { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string OrderId { get; set; }
        public string UserId { get; set; }
        public string ShippingReciver { get; set; }
        public string ShippingPhone { get; set; }
        public string ShippingAddress { get; set; }
        public DateTime CreateDT { get; set; }

        public long TotalPrice { get; set; }
        [JsonIgnore]
        public virtual ICollection<OrderItem> OrderItems{get;set;}
        public string OrderStatus { get; set; }
        
    }
}
