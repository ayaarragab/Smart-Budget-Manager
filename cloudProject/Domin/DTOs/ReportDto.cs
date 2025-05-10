using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domin.DTOs
{
    public  class ReportDto
    {
        public string Desctiption { get; set; }
        public DateTime from { get; set; }
        public DateTime to { get; set; }
        public string UserId { get; set; }

    }
}
