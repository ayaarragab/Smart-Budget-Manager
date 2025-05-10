using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace Domin.Models
{
    public class Budget
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Amount { get; set; }
        public DateTime StartDate { get; set; }            // Budget Start Date
        public DateTime EndDate { get; set; }              // Budget End Date
        public string UserId { get; set; }
        [ValidateNever]
        public User User { get; set; }
        //public int CategoryId { get; set; }
        //[ValidateNever]
        //public Category Category { get; set; }
   
    }
}
