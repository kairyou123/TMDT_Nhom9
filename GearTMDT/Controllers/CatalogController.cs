using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Threading.Tasks;
using GearTMDT.Model;
using GearTMDT.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GearTMDT.Context;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace GearTMDT.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CatalogController : ControllerBase
    {
        private readonly ICatalogRepository _catalog;
        private readonly GearContext _context;
        public CatalogController(ICatalogRepository catalog, GearContext context)
        {
            _context = context;
            _catalog = catalog;
        }

        [HttpGet]
        public async Task<IEnumerable<Catalog>> GetAll()
        {
            return await _catalog.GetAll();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Catalog>> GetById(long id)
        {
            var catalog = await _catalog.GetById(id);

            if (catalog != null)
            {
                return catalog;
            }

            return NotFound();

        }

        [HttpGet("search")]
        public async Task<IEnumerable<Catalog>> GetByName([FromQuery(Name = "name")] string name = "")
        {

            var catalog = await _catalog.GetCatalogWhere(name);

            return catalog;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")] 
        public async Task<ActionResult<Catalog>> Create(Catalog catalog)
        {
            await _catalog.Create(catalog);
            return CreatedAtAction(nameof(GetById), new { id = catalog.Id }, catalog);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")] 
        public async Task<ActionResult> Edit(long id, Catalog catalog)
        {
            if (id != catalog.Id)
            {
                return BadRequest();
            }

            try
            {
                await _catalog.Edit(catalog);
            }
            catch (DbUpdateConcurrencyException) when (!CatalogExists(id))
            {
                return NotFound();
            }

            return Ok();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] 
        public async Task<ActionResult> Delete(long id)
        {
        
            try
            {
                await _catalog.Delete(id);
            }
            catch (Exception) when (!CatalogExists(id))
            {
                return NotFound();
            }

            return Ok();
        }

        private bool CatalogExists(long id)
        {
            return _context.Catalogs.Any(m => m.Id == id);
        }
    }
}