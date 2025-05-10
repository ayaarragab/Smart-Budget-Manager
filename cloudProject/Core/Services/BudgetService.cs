using Core.Interfaces;
using Domin.DTOs;
using Domin.Models;
using Infrastructure.Interfaces;
namespace Core.Services
{
    public class BudgetService :IBudgetService
    {
        private readonly IUintOfWork _unitOfWork;
        public BudgetService(IUintOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Budget>> GetAllAsync()
        {
            return await _unitOfWork.budgets.GetAllAsync();
        }

        public async Task<Budget> GetByIdAsync(int id)
        {
            var budget = await _unitOfWork.budgets.GetByIdAsync(id);
            if (budget == null)
                throw new Exception($"Budget with id {id} not found");
            return budget;
        }

        public async Task AddAsync(BudgetDto model)
        {
            if (model == null)
            {
                throw new ArgumentNullException(nameof(model), "Product model cannot be null");
            }
            var budget = new Budget
            {
                Name = model.Name, 
                Amount = model.Amount,
                //CategoryId = model.CategoryId,
                UserId = model.UserId,
                StartDate = model.StartDate,
                EndDate = model.EndDate
            };
            await _unitOfWork.budgets.AddAsync(budget);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task UpdateAsync(Budget model)
        {
            var budget = await _unitOfWork.budgets.GetByIdAsync(model.Id);
            if (budget == null)
                throw new Exception($"Budget with id {model.Id} not found");
            budget.Name = model.Name;
            budget.Amount = model.Amount;
            //budget.CategoryId = model.CategoryId;
            budget.UserId = model.UserId;
            budget.StartDate = model.StartDate;
            budget.EndDate = model.EndDate;
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            await _unitOfWork.budgets.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}

