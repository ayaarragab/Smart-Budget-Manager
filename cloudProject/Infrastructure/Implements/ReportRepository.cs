using Domain.Models;
using Domin.Models;
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
    public  class ReportRepository : BaseRepository<Report>, IReportRepository
    {
        private readonly AppDbContext _context;
        public ReportRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Report>> GetByUserId(string Id)
        {

            return await _context.Reports.Where(t => t.UserId == Id).ToListAsync();

        }
    }
}
