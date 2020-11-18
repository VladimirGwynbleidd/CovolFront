using Covol.Helpers;
using Covol.Presentacion.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
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
    public class CargaController : ControllerBase
    {
        private readonly string urlProcesamiento;
        private readonly IRequestAsync _requestClient;

        public CargaController(IRequestAsync requestClient)
        {
            _requestClient = requestClient;
        }

        [HttpGet]
        public async Task<IActionResult> Marcadores()
        {
            JObject responseData;

            try
            {
                var data = await _requestClient.GetRequest("/covol/api/carga/marcadores");
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
                else if(responseData["statusHttp"].ToString() == HttpStatusCode.InternalServerError.ToString())
                {
                    return BadRequest(responseData);
                }
                else
                {
                    return BadRequest(responseData);
                }

            }
        }

        [HttpGet]
        public async Task<IActionResult> Bitacora([FromQuery]string level)
        {
            JObject responseData;

            try
            {
                var form = new[] { new KeyValuePair<string, string>("Level", level) };
                var data = await _requestClient.PostRequest("/covol/api/carga/bitacora", form);
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

        [HttpGet]
        public async Task<IActionResult> DetalleLog([FromQuery]Registro registro)
        {
            JObject responseData;

            try
            {

                var form = new[]
                {
                    new KeyValuePair<string, string>("RFC", registro.RFC),
                    new KeyValuePair<string, string>("Permisionario", registro.Permisionario),
                    new KeyValuePair<string, string>("Fecha", registro.Fecha),
                    new KeyValuePair<string, string>("Level", registro.Level),
                };

                var data = await _requestClient.PostRequest("/covol/api/carga/detalleLog", form);
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
    }
}
