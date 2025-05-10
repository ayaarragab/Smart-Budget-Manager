using Domin.Models;
using Infrastructure.Data;
using Infrastructure.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Implements
{
    public class UnitOfWork : IUintOfWork
    {
        private readonly AppDbContext _context;
        public UnitOfWork(AppDbContext context)
        {
            _context = context;
            budgets = new BudgetRepository(context);
            categories = new CategoryRepository(context);
            wallets = new WalletRepository(context);
            transactions = new TransactionRepository(context);
            reports = new ReportRepository(context);
        }

       
        public IbudgetRepository budgets { get; private set; }
        public IcategoryRepository categories { get; private set; }
        public IWalletRepository wallets { get; private set; }
        public ITransactionRepository transactions { get; private set; }
        public IReportRepository reports { get; private set; }
        public void Dispose()
        {
            _context.Dispose();
        }

        public async Task<int> SaveChangesAsync() => await _context.SaveChangesAsync();


    }
}
