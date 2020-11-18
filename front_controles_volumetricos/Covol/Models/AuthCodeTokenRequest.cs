using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Covol.Models
{
    public class AuthCodeTokenRequest
    {
        public string Code { get; set; }
        public string State { get; set; }
    }
}
