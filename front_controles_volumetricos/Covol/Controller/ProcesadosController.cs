using Covol.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using WebApiCore.Models;
namespace Covol.Presentacion.Controller
{
    [Produces("application/json")]
    [Route("covol/api/[controller]/[action]")]
    public class ProcesadosController : ControllerBase
    {
        private readonly string urlProcesamiento;
        private readonly IRequestAsync _requestClient;

        public ProcesadosController(IRequestAsync requestClient)
        {
            _requestClient = requestClient;
        }

        [HttpGet]
        public async Task<IActionResult> Permicionarios([FromQuery]int estatus)
        {
            JObject responseData;

            try
            {
                var form = new[]
                {
                    new KeyValuePair<string, string>("estatus",estatus.ToString())
                };

                var data = await _requestClient.PostRequest("/covol/api/procesados/permicionarios", form);

                return Ok(data);
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
        public async Task<IActionResult> ConsolidadoMaestro([FromQuery]SolicitudPeriodoConsolidado solicitud)
        {
            JObject responseData;

            try
            {
                var form = new[]
               {
                    new KeyValuePair<string, string>("RFC", solicitud.RFC),
                    new KeyValuePair<string, string>("FechaIni", solicitud.FechaIni),
                    new KeyValuePair<string, string>("FechaFin", solicitud.FechaIni)
                };

                var data = await _requestClient.PostRequest("/covol/api/procesados/consolidadomaestro", form);

                return Ok(data);
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
