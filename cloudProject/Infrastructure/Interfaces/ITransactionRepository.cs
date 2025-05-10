using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Models;

namespace Infrastructure.Interfaces
{
    public interface ITransactionRepository: IBaseRepository<Transaction>
    {
        public  Task<IEnumerable<Transaction>> GetByWalletId(int walletId);
        public Task<IEnumerable<Transaction>> GetByDate(DateTime from, DateTime to);

        public Task<IEnumerable<Transaction>> GetByUserId(string userId);
    }
}
