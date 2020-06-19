using GearTMDT.Context;
using GearTMDT.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GearTMDT.Repository
{
    public class ProductRepository : IProductRepository
    {
        private readonly GearContext _context;

        public ProductRepository(GearContext context)
        {
            _context = context;
        }

        public async Task Create(Product model)
        {
            _context.Products.Add(model);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(long Id)
        {
            var product = await _context.Products.FindAsync(Id);
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
        }

        public async Task Edit(Product model)
        {
            _context.Products.Update(model);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Product>> GetAll()
        {
            return await _context.Products.Include(c=>c.Catalog).Include(p=>p.Producer).ToListAsync();
        }

        public async Task<Product> GetById(long Id)
        {
            return await _context.Products.Where(p=>p.Id==Id).Include(c => c.Catalog).Include(p => p.Producer).FirstOrDefaultAsync();
        }

        public async Task<Product> GetProductsSlug(string slug)
        {
            var products = from p in _context.Products select p;
            products = products.Include(p => p.Catalog).Include(p => p.Producer);
            return await products.SingleOrDefaultAsync(p => p.Slug == slug);
        }
    }
}
