using GearTMDT.Context;
using GearTMDT.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GearTMDT.Repository
{
    public class OrderRepository : IOrderRepository
    {
        private readonly GearContext _context;
        public OrderRepository (GearContext context)
        {
            _context = context; 
        }

        public async Task Create(Order model)
        {
            _context.Orders.Add(model);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(long Id)
        {
            var order = await _context.Orders.FindAsync(Id);
            var orderitems = await _context.OrderItems.Where(i => i.OrderId == Id).ToListAsync();
            _context.Orders.Remove(order);
            _context.OrderItems.RemoveRange(orderitems);
            await _context.SaveChangesAsync();
        }

        public async Task Edit(Order model)
        {
            _context.Orders.Update(model);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Order>> GetAll()
        {
            return await _context.Orders.Include(i => i.OrderItems)
                                            .ThenInclude(p => p.Product)
                                                .ThenInclude(p => p.Producer).ToListAsync();
        }

        public async Task<Order> GetById(long Id)
        {
            return await _context.Orders.Where(o => o.Id == Id).Include(i => i.OrderItems).ThenInclude(p => p.Product)
                                                                                                .ThenInclude(p => p.Producer).FirstAsync();
        }

        public async Task<Order> GetByOrderId(string id)
        {
            return await _context.Orders.Where(o => o.OrderId == id).Include(i =>i.OrderItems).ThenInclude(p => p.Product)
                                                                                                    .ThenInclude(p => p.Producer).FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Order>> GetByUserId(string userid)
        {
            return await _context.Orders.Where(o => o.UserId == userid).Include(i => i.OrderItems).ThenInclude(p => p.Product)
                                                                                                        .ThenInclude(p => p.Producer).ToListAsync();
        }

        public async Task<Order> CreateOrder(string userid,string name , string address, string phone, long totalPrice)
        {
            var order = new Order();
            order.OrderId = "O" + userid + ((DateTimeOffset)DateTime.UtcNow).ToUnixTimeSeconds();
            order.UserId = userid;
            order.CreateDT =DateTime.UtcNow.AddHours(7);
            order.OrderStatus ="cho duyet";
            order.ShippingReciver = name;
            order.ShippingPhone = phone;
            order.ShippingAddress = address;
            order.TotalPrice = totalPrice;
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return order;
        }
    }
}
