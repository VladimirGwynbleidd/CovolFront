using System.ComponentModel.DataAnnotations;

namespace Covol.Presentacion.Models
{
    public class TipoProducto
    {
        public int IdProducto { get; set; }
        //[Required, StringLength(2, MinimumLength = 1)]
        public string ClaveProducto { get; set; }
        //[Required, StringLength(100, MinimumLength = 3)]
        public string Producto { get; set; }
        //[Required, StringLength(100, MinimumLength = 3)]
        public string Comentario { get; set; }
    }
}
