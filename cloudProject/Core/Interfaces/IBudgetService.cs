using Domin.DTOs;
using Domin.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IBudgetService
    {
        Task<IEnumerable<Budget>> GetAllAsync();
        Task<Budget> GetByIdAsync(int id);
        Task AddAsync(BudgetDto model);
        Task UpdateAsync(Budget model);
        Task DeleteAsync(int id);
    }
}
