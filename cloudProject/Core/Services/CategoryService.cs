using Core.Interfaces;
using Domin.DTOs;
using Domin.Models;
using Infrastructure.Interfaces;

namespace Core.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly IUintOfWork _unitOfWork;
        public CategoryService(IUintOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Category>> GetAllAsync()
        {
            return await _unitOfWork.categories.GetAllAsync();
        }

        public async Task<Category> GetByIdAsync(int id)
        {
            var category = await _unitOfWork.categories.GetByIdAsync(id);
            if (category == null)
                throw new Exception($"Category with id {id} not found");
            return category;
        }

        public async Task AddAsync(CategoryDto model)
        {
            if (model == null)
            {
                throw new ArgumentNullException(nameof(model), "category model cannot be null");
            }
            var category = new Category
            {
                Id = model.Id,
                Name = model.Name,
                UserId = model.UserId
            };
            await _unitOfWork.categories.AddAsync(category);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task UpdateAsync(Category model)
        {
            var category = await _unitOfWork.categories.GetByIdAsync(model.Id);
            if (category == null)
                throw new Exception($"category with id {model.Id} not found");
            category.Id = model.Id; 
            category.Name = model.Name;
            category.UserId = model.UserId;
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            await _unitOfWork.categories.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();
        }
    }

}

