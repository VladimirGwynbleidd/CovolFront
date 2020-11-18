using System.ComponentModel.DataAnnotations;

namespace Covol.Presentacion.Models
{
    public class Estimulo
    {
        public int IdValorEstimulo { get; set; }
        public decimal valorMagna { get; set; }
        public decimal valorPremium { get; set; }

    }
}
