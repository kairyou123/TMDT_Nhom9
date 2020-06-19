using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using GearTMDT.Context;
using GearTMDT.Model;
using GearTMDT.Repository;
using GearTMDT.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GearTMDT.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly GearContext _context;
        private readonly IProductRepository _products;
        private readonly IWebHostEnvironment _env;

        public ProductController(GearContext context, IProductRepository products, IWebHostEnvironment env)
        {
            _context = context;
            _products = products;
            _env = env;
        }

        [HttpGet]
        public async Task<IEnumerable<Product>> GetAll()
        {
            return await _products.GetAll();
        }

        [HttpGet("{slug}")]
        public async Task<ActionResult<Product>> GetBySlug(string slug)
        {

            var product = await _products.GetProductsSlug(slug);
            if(product != null) return product;
            return NotFound();
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Product>> Create(Product product)
        {
            var slug = SlugGenerator.Generate(product.Name);
            product.Slug = slug;
            product.PriceDiscount = product.Price - (product.Price * product.Discount / 100);
            await _products.Create(product);
            return CreatedAtAction(nameof(GetBySlug), new { slug = product.Slug }, product);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Edit(long id, Product product)
        {
            if (id != product.Id)
            {
                return BadRequest();
            }
            var slug = SlugGenerator.Generate(product.Name);
            product.Slug = slug;

            try
            {
                product.PriceDiscount = product.Price - (product.Price * product.Discount / 100);
                await _products.Edit(product);
            }
            catch (DbUpdateConcurrencyException) when (!ProductExists(id))
            {
                return NotFound();
            }

            return Ok(slug);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Delete(long id)
        {
            try
            {
                await _products.Delete(id);
            }
            catch (Exception) when (!ProductExists(id))
            {
                return NotFound();
            }

            return Ok();
        }

        [HttpPost("image")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> OnUploadImage([FromForm] IFormFile file, string slug)
        {
            var uploads = Path.Combine(_env.WebRootPath, "Image");
            List<string> names = new List<string>();
            try {
                    if (file.Length > 0)
                    { 
                        var extension = Path.GetExtension(file.FileName);
                        names.Add(file.FileName);
                        
                        using (var fileStream = new FileStream(Path.Combine(uploads, file.FileName), FileMode.Create))
                        {
                            await file.CopyToAsync(fileStream);
                            return Ok(names);
                        }
                    }
            }
            catch { 
                return NotFound();
            }

            return NotFound();
            
        }

        

        private bool ProductExists(long id)
        {
            return _context.Products.Any(m => m.Id == id);
        }
    }
}