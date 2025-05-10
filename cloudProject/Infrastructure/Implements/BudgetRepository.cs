using Domin.Models;
using Infrastructure.Data;
using Infrastructure.Interfaces;

namespace Infrastructure.Implements
{
    public class BudgetRepository : BaseRepository<Budget>, IbudgetRepository
    {
        public BudgetRepository(AppDbContext context) : base(context)
        {
            //getBudgetProgress(userId, budgetId): Calculate spending vs budget
        }
    }
}

