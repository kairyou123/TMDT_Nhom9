using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GearTMDT.Context;
using GearTMDT.Model;
using GearTMDT.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace GearTMDT.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")] 
    public class ProducerController : ControllerBase
    {
        private readonly GearContext _context;
        private readonly IProducerRepository _producer;

        public ProducerController(GearContext context, IProducerRepository producer)
        {
            _context = context;
            _producer = producer;
        }

        [HttpGet]
        public async Task<IEnumerable<Producer>> GetAll()
        {
            return await _producer.GetAll();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Producer>> GetById(long id)
        {
            var producer = await _producer.GetById(id);

            if (producer != null)
            {
                return producer;
            }

            return NotFound();

        }

        [HttpGet("search")]
        public async Task<IEnumerable<Producer>> GetByName([FromQuery(Name = "name")] string name = "")
        {

            var producer = await _producer.GetProducerWhere(name);

            return producer;
        }

        [HttpPost]
        public async Task<ActionResult<Producer>> Create(Producer producer)
        {
            await _producer.Create(producer);
            return CreatedAtAction(nameof(GetById), new { id = producer.Id }, producer);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Edit(long id, Producer producer)
        {
            if (id != producer.Id)
            {
                return BadRequest();
            }

            try
            {
                await _producer.Edit(producer);
            }
            catch (DbUpdateConcurrencyException) when (!ProducerExists(id))
            {
                return NotFound();
            }

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(long id)
        {

            try
            {
                await _producer.Delete(id);
            }
            catch (Exception) when (!ProducerExists(id))
            {
                return NotFound();
            }

            return Ok();
        }

        private bool ProducerExists(long id)
        {
            return _context.Producers.Any(m => m.Id == id);
        }
    }
}