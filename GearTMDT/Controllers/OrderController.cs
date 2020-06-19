using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GearTMDT.Context;
using GearTMDT.Model;
using GearTMDT.Repository;
using Microsoft.EntityFrameworkCore.Query.Internal;
using Microsoft.AspNetCore.Authorization;

namespace GearTMDT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly GearContext _context;
        private readonly IOrderRepository _order;
        private readonly IOrderItemRepository _item;
        private readonly ICartItemRepository _cart;
        private readonly IProductRepository _product;

        public OrderController(GearContext context,IOrderItemRepository item ,IOrderRepository order, ICartItemRepository cart, IProductRepository product)
        {
            _context = context;
            _item = item;
            _order = order;
            _cart = cart;
            _product = product;
        }

        // GET: api/Order
        [HttpGet]
        public async Task<IEnumerable<Order>> GetAll()
        {
            return await _order.GetAll();
        }

        [HttpGet("user/{userId}")]
        public async Task<IEnumerable<Order>> GetByUserId(string userId)
        {
            return await _order.GetByUserId(userId);
        }
        

        // GET: api/Order/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(long id)
        {
            var order = await _order.GetById(id);

            if (order == null)
            {
                return NotFound();
            }

            return order;
        }

        

        // PUT: api/Order/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> Edit(long id, OrderStatus OrderStatus)
        {
            var order = _context.Orders.Include(i => i.OrderItems).ThenInclude(p => p.Product).SingleOrDefault(o => o.Id == id);
            
            if(order == null) {
                return NotFound("Không tìm thấy đơn hàng");
            }
            
            order.OrderStatus = OrderStatus.orderstatus;
           
            try
            {
                if(order.OrderStatus == "Đã hủy")
                {
                    List<OrderItem> item = order.OrderItems.ToList();
                    foreach (var i in item)
                    {
                        var p = i.Product;
                        p.Stock = p.Stock + i.Quantity;
                        await _product.Edit(p);
                    }
                }
                await _order.Edit(order);

            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Order
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(CreateOrder createOrder)
        {
            var userid = createOrder.userid;
            var name = createOrder.name;
            var address = createOrder.address;
            var phone = createOrder.phone;
            long totalPrice = 0;
            var carts = await _cart.GetCartbyUserId(userid);
            
            if(!carts.Any()) {
                return NotFound("Không có sản phẩm nào trong giỏ hàng");
            }

            foreach (CartItem item in carts)
            {
                totalPrice = totalPrice + (item.Product.PriceDiscount * item.Quantity);
            }

            Order order = await _order.CreateOrder(userid,name,address,phone, totalPrice);
            foreach (CartItem item in carts)
            {
                await _item.CreateOrderItem(item,order.Id);
                var product = await _product.GetById(item.ProductId);
                product.Stock = product.Stock - item.Quantity;
                await _product.Edit(product);
                await _cart.Delete(item.Id);
            }

            
            return CreatedAtAction(nameof(GetOrder),new{id = order.Id},order);
        }
        // DELETE: api/Order/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Order>> DeleteOrder(long id)
        {
            try
            {
                await _order.Delete(id);
            }
            catch (Exception) when (!OrderExists(id))
            {
                return NotFound();
            }

            return Ok();
        }

        private bool OrderExists(long id)
        {
            return _context.Orders.Any(e => e.Id == id);
        }
    }
}
