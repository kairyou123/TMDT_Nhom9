using System.Collections.Generic;
using System.Threading.Tasks;
using GearTMDT.Model;
using Microsoft.AspNetCore.Mvc;

namespace GearTMDT.Repository
{
    public interface IProducerRepository : IRepository<Producer>
    {
        Task<IEnumerable<Producer>> GetProducerWhere(string search);
    }
}