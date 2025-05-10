using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domin.DTOs
{
    public  class WalletDto
    {
        
        public string Name { get; set; }
        public WalletType Type { get; set; }

        public string  UserId { get; set; }


    }
}
