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
    public class SubProductoController : ControllerBase
    {
        private readonly string urlProcesamiento;
        private readonly IRequestAsync _requestClient;

        public SubProductoController(IRequestAsync requestClient)
        {
            _requestClient = requestClient;
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerSubProducto()
        {
            JObject responseData;
            try
            {
                var data = await _requestClient.GetRequest("/covol/api/subproducto/obtenersubproducto");
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
        public async Task<IActionResult> AgregarSubProducto([FromBody] SubProducto subProducto)
        {
            JObject responseData;

            try
            {
                TryValidateModel(subProducto);
                if (ModelState.IsValid)
                {
                    var form = new[]
                      {
                        new KeyValuePair<string, string>("IdSubProducto", subProducto.IdSubProducto.ToString()),
                        new KeyValuePair<string, string>("ClaveProducto", subProducto.ClaveProducto),
                        new KeyValuePair<string, string>("ClaveSubProducto", subProducto.ClaveSubProducto),
                        new KeyValuePair<string, string>("DetalleSubProducto", subProducto.DetalleSubProducto),
                        new KeyValuePair<string, string>("Comentario", subProducto.Comentario)
                    };

                    var data = await _requestClient.PostRequest("/covol/api/subproducto/agregarsubproducto", form);
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
        public async Task<IActionResult> ActualizarSubProducto([FromBody] SubProducto subProducto)
        {
            JObject responseData;
            try
            {
                TryValidateModel(subProducto);
                if (ModelState.IsValid)
                {
                    var form = new[]
                      {
                        new KeyValuePair<string, string>("IdSubProducto", subProducto.IdSubProducto.ToString()),
                        new KeyValuePair<string, string>("ClaveProducto", subProducto.ClaveProducto),
                        new KeyValuePair<string, string>("ClaveSubProducto", subProducto.ClaveSubProducto),
                        new KeyValuePair<string, string>("DetalleSubProducto", subProducto.DetalleSubProducto),
                        new KeyValuePair<string, string>("Comentario", subProducto.Comentario)
                    };

                    var data = await _requestClient.PutRequest("/covol/api/subproducto/actualizarsubproducto", form);
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
        public async Task<IActionResult> EliminarSubProducto([FromBody] int IdSubProducto)
        {
            JObject responseData;
            try
            {
                
                if (IdSubProducto != 0)
                {
                    var data = await _requestClient.DeleteRequest($"/covol/api/subproducto/eliminarsubproducto?id={IdSubProducto.ToString()}");
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
