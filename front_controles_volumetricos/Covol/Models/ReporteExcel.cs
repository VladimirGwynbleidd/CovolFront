using System.ComponentModel.DataAnnotations;

namespace WebApiCore.Models
{
    public class ReporteExcel
    {
        [Required]
        [StringLength(13)]
        public string RFC { get; set; }
        [StringLength(200)]
        public string NoCRE { get; set; }
        [Required]
        [StringLength(10)]
        public string FechaIni { get; set; }
        [Required]
        [StringLength(10)]
        public string FechaFin { get; set; }
    }
}
