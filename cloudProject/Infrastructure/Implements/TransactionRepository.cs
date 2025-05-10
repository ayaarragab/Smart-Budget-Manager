using Infrastructure.Data;
using Infrastructure.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Implements
{
    public class TransactionRepository:BaseRepository<Transaction>, ITransactionRepository


    {
        private readonly AppDbContext _context;
        public TransactionRepository(AppDbContext context) : base(context)
        {
            _context = context; 
        }
        public async Task<IEnumerable<Transaction>> GetByWalletId(int walletId)
        { 
            
            return await _context.Transactions.Where(t => t.WalletId == walletId).ToListAsync(); 
        
        }
        public async Task<IEnumerable<Transaction>> GetByDate(DateTime from, DateTime to)
        {
            return await _context.Transactions.Where(t => t.Date >= from && t.Date <= to).ToListAsync();

        }

        public async Task<IEnumerable<Transaction>> GetByUserId(string userId)
        {
            return await _context.Transactions
                .Where(t => t.UserId == userId)
                .ToListAsync();
        }


    }
}
