using GearTMDT.Context;
using GearTMDT.Model;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GearTMDT.Repository
{
    public class OrderItemRepository : IOrderItemRepository
    {
        private readonly GearContext _context;
        public OrderItemRepository(GearContext context)
        {
            _context = context;
        }
        public async Task Create(OrderItem model)
        {
            _context.OrderItems.Add(model);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(long Id)
        {
            var orderItem = await _context.OrderItems.FindAsync(Id);
            _context.OrderItems.Remove(orderItem);
            await _context.SaveChangesAsync();
        }

        public async Task Edit(OrderItem model)
        {
            _context.OrderItems.Update(model);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<OrderItem>> GetAll()
        {
            return await _context.OrderItems.ToListAsync();
        }

        public async Task<OrderItem> GetById(long Id)
        {
            return await _context.OrderItems.FindAsync(Id);
        }

        public async Task CreateOrderItem(CartItem item, long orderid)
        {
            var Item = new OrderItem();
            Item.OrderId = orderid;
            Item.ProductId = item.ProductId;
            Item.Quantity = item.Quantity;
            _context.OrderItems.Add(Item);
            await _context.SaveChangesAsync();
        }

    }
}
