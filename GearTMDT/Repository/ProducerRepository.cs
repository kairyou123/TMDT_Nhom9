using GearTMDT.Context;
using GearTMDT.Model;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GearTMDT.Repository
{
    public class ProducerRepository : IProducerRepository
    {
        private readonly GearContext _context;

        public ProducerRepository (GearContext context)
        {
            _context = context;
        }
        public async Task Create(Producer model)
        {
            _context.Producers.Add(model);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(long Id)
        {
            var producer = await _context.Producers.FindAsync(Id);
            _context.Producers.Remove(producer);
            await _context.SaveChangesAsync();
        }

        public async Task Edit(Producer model)
        {
            _context.Producers.Update(model);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Producer>> GetAll()
        {
            return await _context.Producers.ToListAsync();
        }

        public async Task<Producer> GetById(long Id)
        {
            return await _context.Producers.FindAsync(Id);
        }

        public async Task<IEnumerable<Producer>> GetProducerWhere(string name)
        {
            var producers = from p in _context.Producers select p;
            producers = producers.Where(p => p.Name.Contains(name));
            return await producers.ToListAsync();
        }
    }
}