using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GearTMDT.Context;
using GearTMDT.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GearTMDT.Repository
{
    public class CatalogRepository : ICatalogRepository
    {
        private readonly GearContext _context;

        public CatalogRepository(GearContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Catalog>> GetAll()
        {
            return await _context.Catalogs.ToListAsync();
        }

        public async Task<Catalog> GetById(long Id)
        {
            return await _context.Catalogs.FindAsync(Id);
        }

        public async Task<IEnumerable<Catalog>> GetCatalogWhere(string name)
        {
            var catalogs = from c in _context.Catalogs select c; 
            catalogs = catalogs.Where(c => c.Name.ToLower().Contains(name.ToLower()));
               

            return await catalogs.ToListAsync();     
        }
        public async Task Create(Catalog catalog)
        {
            _context.Catalogs.Add(catalog);
            await _context.SaveChangesAsync();
        }

        public async Task Edit(Catalog catalog)
        {
             _context.Update(catalog);
             await _context.SaveChangesAsync();

        }

        public async Task Delete(long id)
        {
            var catalog = await _context.Catalogs.FindAsync(id);
            _context.Catalogs.Remove(catalog);
            await _context.SaveChangesAsync();
        }


        

        
    }
}