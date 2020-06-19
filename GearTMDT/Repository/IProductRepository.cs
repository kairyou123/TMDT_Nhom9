using GearTMDT.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GearTMDT.Repository
{
    public interface IProductRepository : IRepository<Product>
    {
        Task<Product> GetProductsSlug(String slug);
    }
}
