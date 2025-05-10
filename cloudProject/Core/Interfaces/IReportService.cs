using Domain.Models;
using Domin.DTOs;
using Domin.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public  interface IReportService
    {
       Task<IEnumerable<Report>> GetAllAsync();
        Task<Report> GetByIdAsync(int id);
        Task AddAsync(ReportDto  model);
        Task UpdateAsync(int id,ReportDto model);
        Task DeleteAsync(int id);
        Task<IEnumerable<Report>> GetByUserId(string usertId);
    }
}
