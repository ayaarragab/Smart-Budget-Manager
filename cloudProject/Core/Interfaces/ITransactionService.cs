using Domin.DTOs;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface ITransactionService
    {
        Task<IEnumerable<Transaction>> GetAllAsync();
        Task<IEnumerable<Transaction>> GetByWalletId(int id);

        Task<Transaction> GetByIdAsync(int id);
        Task AddAsync(TransactionDto model);
        Task UpdateAsync(int id,TransactionDto model);
        Task DeleteAsync(int id);
        Task<IEnumerable<Transaction>> GetByDate(DateTime from, DateTime to);
    }

}
