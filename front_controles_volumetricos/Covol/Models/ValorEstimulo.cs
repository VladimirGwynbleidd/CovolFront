using System.ComponentModel.DataAnnotations;

namespace Covol.Presentacion.Models
{
    public class ValorEstimulo
    {
        public int IdValorEstimulo { get; set; }
        public int ClaveSubProducto { get; set; }
        public decimal Valor { get; set; }
        [Required, StringLength(100, MinimumLength = 3)]
        public string DescripcionValor { get; set; }
        [Required, StringLength(100, MinimumLength = 3)]
        public decimal valorMagna { get; set; }
        [Required, StringLength(10, MinimumLength = 3)]
        public decimal valorPremium { get; set; }
        [Required, StringLength(10, MinimumLength = 3)]
        public string Comentario { get; set; }
    }
}
