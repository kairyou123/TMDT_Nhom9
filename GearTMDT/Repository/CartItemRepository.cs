using GearTMDT.Context;
using GearTMDT.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace GearTMDT.Repository
{
    public class CartItemRepository : ICartItemRepository
    {
        private readonly GearContext _context;
        private const string CartSession = "CartSession";

        public CartItemRepository(GearContext context)
        {
            _context = context; 
        }

        public async Task<IEnumerable<CartItem>> GetCartbyUserId(string id)
        {
            return await _context.CartItems.Where(c => c.UserId == id).Include(p=>p.Product).ToListAsync();
        }

        public async Task<IEnumerable<CartItem>> GetAll()
        {
            return await _context.CartItems.Include(p=>p.Product).ToListAsync();
        }

        public async Task<CartItem> GetById(long Id)
        {
            return await _context.CartItems.Where(c=>c.Id==Id).Include(p=>p.Product).FirstOrDefaultAsync();
        }

        public async Task Create(CartItem model)
        {
            _context.CartItems.Add(model);
            await _context.SaveChangesAsync();
        }

        public async Task Edit(CartItem model)
        {
            _context.CartItems.Update(model);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(long Id)
        {
            var cart = await _context.CartItems.FindAsync(Id);
            _context.CartItems.Remove(cart);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteByUser(string userid)
        {
            var carts =await this.GetCartbyUserId(userid);
            _context.CartItems.RemoveRange(carts);
            await _context.SaveChangesAsync();
        }
    }
}
