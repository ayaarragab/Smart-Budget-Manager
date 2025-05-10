using Domain.Models;
using Infrastructure.Data;
using Infrastructure.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Implements
{
    public  class WalletRepository: BaseRepository<Wallet>,IWalletRepository
    {
        private readonly AppDbContext _context;
        public WalletRepository(AppDbContext context) : base(context)
        {
            _context = context;

        }
        public async Task<IEnumerable<Wallet>> GetByUserId(string Id)
        {

            return await _context.Wallets.Where(t => t.UserId ==Id).ToListAsync();

        }
        public  async Task<IEnumerable<Wallet>> GetByDate(DateTime from, DateTime to)
        {
            return await _context.Wallets.Where(t => t.Date>=from&&t.Date<=to).ToListAsync();

        }
    }
}
