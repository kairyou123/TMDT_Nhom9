using GearTMDT.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GearTMDT.Repository
{
    public interface ICartItemRepository : IRepository<CartItem>
    {
        Task<IEnumerable<CartItem>> GetCartbyUserId(string id);
        Task DeleteByUser (string userid);
    }
}

