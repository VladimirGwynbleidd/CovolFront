using System.ComponentModel.DataAnnotations;

namespace Covol.Presentacion.Models
{
    public class SubProducto
    {
        //[Required]
        public int IdSubProducto { get; set; }
        //[Required, StringLength(4, MinimumLength = 1)]
        public string ClaveProducto { get; set; }
        //[Required, StringLength(6, MinimumLength = 1)]
        public string ClaveSubProducto { get; set; }
        //[Required, StringLength(100, MinimumLength = 3)]
        public string DetalleSubProducto { get; set; }
        //[Required, StringLength(100, MinimumLength = 3)]
        public string Comentario { get; set; }
    }
}
