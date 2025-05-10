using Domain.Models;
using Domin.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Interfaces
{
    public interface IReportRepository:IBaseRepository<Report>
    {
        public Task<IEnumerable<Report>> GetByUserId(string usertId);
    }
}
