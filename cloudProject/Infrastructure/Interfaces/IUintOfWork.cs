using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Interfaces
{
    public interface IUintOfWork : IDisposable
    {
       IbudgetRepository budgets { get; }
       IcategoryRepository categories { get; }
        IWalletRepository wallets { get; }
        ITransactionRepository transactions { get; }
        IReportRepository reports { get; }
        Task<int> SaveChangesAsync();
    }
   
}
