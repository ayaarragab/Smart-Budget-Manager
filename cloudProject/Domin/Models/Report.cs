using Domain.Models;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domin.Models
{
    public  class Report
    {
        public int Id { get; set; } 
        public string Desctiption { get; set; }
        public DateTime from { get; set; }
        public DateTime to { get; set; }    
        public decimal TotalIncome { get; set; }
        public decimal TotalExpense { get; set; }
        public string UserId { get; set; }

        [ValidateNever]
        public User User { get; set; }

    }
}
