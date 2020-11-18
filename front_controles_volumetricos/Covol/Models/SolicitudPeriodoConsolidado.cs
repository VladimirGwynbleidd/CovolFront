using System.ComponentModel.DataAnnotations;

namespace WebApiCore.Models
{
    public class SolicitudPeriodoConsolidado
    {
        [Required]
        [StringLength(13)]
        public string RFC { get; set; }
        [Required]
        [StringLength(25)]
        public string FechaIni { get; set; }
        [Required]
        [StringLength(25)]
        public string FechaFin { get; set; }

        [StringLength(25)]
        public string NoCRE { get; set; }
    }
}
