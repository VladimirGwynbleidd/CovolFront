using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Xunit;

namespace XUnitTestCovol
{
    public class UnitTest1
    {
        [Fact]
        public void ObtenerTipoProductoTest()
        {
            var data = JObject.FromObject(new
            {
                Exito = true,
                Mensaje = "Resultado exitoso",
                Valor = 0,
                ResponseDataEnumerable = new
                {
                    IdProducto = 1,
                    ClaveProducto = "001",
                    Producto = "Diesel",
                    Comentario = ""
                },
            });

            Assert.IsType<JObject>(data);
        }
    }
}
