using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Interfaces
{
    public interface IWalletRepository: IBaseRepository<Wallet>
    {
        public Task<IEnumerable<Wallet>> GetByUserId(string usertId);
        public Task<IEnumerable<Wallet>> GetByDate(DateTime from ,DateTime to );

    }
}
