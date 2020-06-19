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

namespace GearTMDT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartsController : ControllerBase
    {
        private readonly GearContext _context;
        private readonly ICartItemRepository _cartRepository;

        public CartsController(GearContext context,ICartItemRepository cartRepository)
        {
            _context = context;
            _cartRepository = cartRepository;
        }

        // GET: api/Carts
        [HttpGet]
        public async Task<IEnumerable<CartItem>> GetAll()
        {
            return await _cartRepository.GetAll();
        }

        // GET: api/Carts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CartItem>> GetById(long id)
        {
            var cart = await _cartRepository.GetById(id);

            if (cart == null)
            {
                return NotFound();
            }

            return cart;
        }

        [HttpGet("user/{Userid}")]
        public async Task<IEnumerable<CartItem>> GetByUserId(string Userid)
        {

            var cart= await _cartRepository.GetCartbyUserId(Userid);

            return cart;
        }

        // PUT: api/Carts/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> Edit(long id, CartItem cart)
        {
            if (id != cart.Id)
            {
                return BadRequest();
            }
            try
            {
                await _cartRepository.Edit(cart);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CartExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok();
        }

        // POST: api/Carts
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<CartItem>> Create(CartItem cart)
        {
            await _cartRepository.Create(cart);
            return CreatedAtAction("GetById", new { id = cart.Id }, cart);
        }

        // DELETE: api/Carts/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<CartItem>> Delete(long id)
        {
            try
            {
                await _cartRepository.Delete(id);
            }
            catch (Exception) when (!CartExists(id))
            {
                return NotFound();
            }

            return Ok();
        }

        [HttpDelete("User/{userid}")]
        public async Task<ActionResult<CartItem>> DeleteByUser(string userid)
        {
            try
            {
                await _cartRepository.DeleteByUser(userid);
            }
            catch (Exception) when (!UserHaveCart(userid))
            {
                return NotFound();
            }
            return Ok();
        }

        private bool CartExists(long id)
        {
            return _context.CartItems.Any(e => e.Id == id);
        }

        private bool UserHaveCart(string userid)
        {
            return _context.CartItems.Any(u=>u.UserId==userid);
        }
    }
}
