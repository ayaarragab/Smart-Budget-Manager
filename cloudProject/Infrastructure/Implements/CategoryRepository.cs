using Domin.Models;
using Infrastructure.Data;
using Infrastructure.Interfaces;

namespace Infrastructure.Implements
{
    public class CategoryRepository : BaseRepository<Category>, IcategoryRepository
    {
        public CategoryRepository(AppDbContext context) : base(context)
        {
            //
        }
    }
}
