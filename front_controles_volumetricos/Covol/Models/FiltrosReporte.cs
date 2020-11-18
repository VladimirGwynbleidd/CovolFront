using System.ComponentModel.DataAnnotations;

namespace WebApiCore.Models
{
    public class FiltrosReporte
    {
        [StringLength(13)]
        public string RFC { get; set; }
        [StringLength(200)]
        public string NoCRE { get; set; }
        [StringLength(2)]
        public string TipodeRegistro { get; set; }
        [StringLength(3)]
        public string TipoProducto { get; set; }
        [Required]
        [StringLength(20)]
        public string FechaIni { get; set; }
        [Required]
        [StringLength(20)]
        public string FechaFin { get; set; }
    }
}
