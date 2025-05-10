using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domin.DTOs
{
    public  class TransactionDto
    {
        public decimal Amount { get; set; }
        public int CategoryId { get; set; }
        public DateTime Date { get; set; }
        public int WalletId { get; set; }
        public TransactionType Type { get; set; }
        public string Description { get; set; }
    }
}
