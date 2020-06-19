using System.Collections.Generic;
using System.Threading.Tasks;

namespace GearTMDT.Repository
{
    public interface IRepository<T> where T : class
    {
        public Task<IEnumerable<T>> GetAll();
        public Task<T> GetById(long Id);
        public Task Create(T model);
        public Task Edit(T model);
        public Task Delete(long Id);
    }
}