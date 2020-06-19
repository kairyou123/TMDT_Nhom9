using System.Collections.Generic;
using System.Threading.Tasks;
using GearTMDT.Model;
using Microsoft.AspNetCore.Mvc;

namespace GearTMDT.Repository
{
    public interface ICatalogRepository : IRepository<Catalog>
    {
        Task<IEnumerable<Catalog>> GetCatalogWhere(string search);

    }
}