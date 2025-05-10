using Domain.Models;
using Domin.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
   public  interface IWalletService
    {
        Task<IEnumerable<Wallet>> GetAllAsync();
        Task<Wallet> GetByIdAsync(int id);
        Task AddAsync(WalletDto model);
        Task UpdateAsync(int id ,WalletDto model);
        Task DeleteAsync(int id);
        Task<IEnumerable<Wallet>> GetByUserId(string usertId);
        Task<IEnumerable<Wallet>> GetByDate(DateTime from, DateTime to);
    }
}
