using Domain.Models;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;


namespace Domin.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string UserId { get; set; }
        // Navigation property
        [ValidateNever]
        public User User { get; set; }
        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
        //public ICollection<Budget> Budgets { get; set; } = new List<Budget>();
    }
}
