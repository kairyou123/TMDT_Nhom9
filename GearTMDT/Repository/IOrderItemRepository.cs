using GearTMDT.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GearTMDT.Repository
{
    public interface IOrderItemRepository : IRepository<OrderItem>
    {
        Task CreateOrderItem (CartItem item, long orderid);
    }
}
