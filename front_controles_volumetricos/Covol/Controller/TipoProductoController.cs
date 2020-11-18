using Covol.Helpers;
using Covol.Presentacion.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace Covol.Presentacion.Controller
{
    [Produces("application/json")]
    [Route("covol/api/[controller]/[action]")]
    public class TipoProductoController : ControllerBase
    {
        private readonly string urlProcesamiento;
        private readonly IRequestAsync _requestClient;

        public TipoProductoController(IRequestAsync requestClient)
        {
            _requestClient = requestClient;
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerTipoProducto()
        {
            JObject responseData;
            try
            {
                var data = await _requestClient.GetRequest("/covol/api/tipoproducto/obtenertipoproducto");
                responseData = JObject.FromObject(data);
                

                return Ok(responseData);
            }
            catch (Exception ex)
            {
                responseData = JObject.FromObject(JsonConvert.DeserializeObject(ex.Message));
                

                if (responseData["statusHttp"].ToString() == HttpStatusCode.Unauthorized.ToString())
                {
                    return Unauthorized(responseData);
                }
                else if (responseData["statusHttp"].ToString() == HttpStatusCode.InternalServerError.ToString())
                {
                    return BadRequest(responseData);
                }
                else
                {
                    return BadRequest(responseData);
                }
            }
        }

        [HttpPost]
        public async Task<IActionResult> AgregarTipoProducto([FromBody] TipoProducto tipoProducto)
        {
            JObject responseData;
            try
            {
                TryValidateModel(tipoProducto);
                if (ModelState.IsValid)
                {

                    var form = new[]
                    {
                        new KeyValuePair<string, string>("IdProducto", tipoProducto.IdProducto.ToString()),
                        new KeyValuePair<string, string>("ClaveProducto", tipoProducto.ClaveProducto),
                        new KeyValuePair<string, string>("Producto", tipoProducto.Producto),
                        new KeyValuePair<string, string>("Comentario", tipoProducto.Comentario)
                    };
                    var data = await _requestClient.PostRequest("/covol/api/tipoproducto/agregartipoproducto", form);
                    responseData = JObject.FromObject(data);
                    

                    return Ok(responseData);

                }
                else
                {
                    return BadRequest(ModelState);
                }
            }
            catch (Exception ex)
            {
                responseData = JObject.FromObject(JsonConvert.DeserializeObject(ex.Message));
                

                if (responseData["statusHttp"].ToString() == HttpStatusCode.Unauthorized.ToString())
                {
                    return Unauthorized(responseData);
                }
                else if (responseData["statusHttp"].ToString() == HttpStatusCode.InternalServerError.ToString())
                {
                    return BadRequest(responseData);
                }
                else
                {
                    return BadRequest(responseData);
                }
            }
        }

        [HttpPut]
        public async Task<IActionResult> ActualizarTipoProducto([FromBody] TipoProducto tipoProducto)
        {
            JObject responseData;
            try
            {
                TryValidateModel(tipoProducto);

                if (ModelState.IsValid)
                {
                    var form = new[]
                    {
                        new KeyValuePair<string, string>("IdProducto", tipoProducto.IdProducto.ToString()),
                        new KeyValuePair<string, string>("ClaveProducto", tipoProducto.ClaveProducto),
                        new KeyValuePair<string, string>("Producto", tipoProducto.Producto),
                        new KeyValuePair<string, string>("Comentario", tipoProducto.Comentario)
                    };

                    var data = await _requestClient.PutRequest("/covol/api/tipoproducto/actualizartipoproducto", form);
                    responseData = JObject.FromObject(data);
                    

                    return Ok(responseData);
                }
                else
                {
                    return BadRequest(ModelState);
                }
            }
            catch (Exception ex)
            {
                responseData = JObject.FromObject(JsonConvert.DeserializeObject(ex.Message));
                

                if (responseData["statusHttp"].ToString() == HttpStatusCode.Unauthorized.ToString())
                {
                    return Unauthorized(responseData);
                }
                else if (responseData["statusHttp"].ToString() == HttpStatusCode.InternalServerError.ToString())
                {
                    return BadRequest(responseData);
                }
                else
                {
                    return BadRequest(responseData);
                }
            }
        }

        [HttpDelete]
        public async Task<IActionResult> EliminarTipoProducto([FromBody] int tipoProducto)
        {
            JObject responseData;
            try
            {
                 //TryValidateModel(tipoProducto);
                if (tipoProducto != 0)
                {
                    var data = await _requestClient.DeleteRequest($"/covol/api/tipoproducto/eliminartipoproducto?id={tipoProducto.ToString()}");
                    responseData = JObject.FromObject(data);

                    return Ok(responseData);
                }
                else
                {
                    return BadRequest(ModelState);
                }
            }
            catch (Exception ex)
            {
                responseData = JObject.FromObject(JsonConvert.DeserializeObject(ex.Message));
                
                
                if (responseData["statusHttp"].ToString() == HttpStatusCode.Unauthorized.ToString())
                {
                    return Unauthorized(responseData);
                }
                else if (responseData["statusHttp"].ToString() == HttpStatusCode.InternalServerError.ToString())
                {
                    return BadRequest(responseData);
                }
                else
                {
                    return BadRequest(responseData);
                }
            }
        }
    }

}
