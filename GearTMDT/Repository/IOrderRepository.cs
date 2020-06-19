using GearTMDT.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GearTMDT.Repository
{
    public interface IOrderRepository : IRepository<Order>
    {
        Task<Order> GetByOrderId(string id);
        Task<IEnumerable<Order>> GetByUserId(string userid);

        Task<Order> CreateOrder(string userid,string name , string address, string phone, long totalPrice);
    }
}
