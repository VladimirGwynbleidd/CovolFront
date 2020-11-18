using Covol.Helpers;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using WebApiCore.Models;
using Microsoft.Extensions.Logging;

namespace Covol.Presentacion.Controller
{
    [Produces("application/json")]
    [Route("covol/api/[controller]/[action]")]
    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public class ReportesController : ControllerBase
    {
        private readonly string urlProcesamiento;
        private readonly IRequestAsync _requestClient;
        public ILogger<ReportesController> Logger { get; }

        public ReportesController(IRequestAsync requestClient, ILogger<ReportesController> logger)
        {
            _requestClient = requestClient;
            Logger = logger;
        }
        
        [HttpGet]
        public async Task<IActionResult> Permicionarios([FromQuery]FiltrosReporte filtros)
        {
            JObject responseData;

            try
            {
                var form = new[]
                {
                    new KeyValuePair<string, string>("RFC", filtros.RFC),
                    new KeyValuePair<string, string>("NoCRE", filtros.NoCRE),
                    new KeyValuePair<string, string>("TipodeRegistro", filtros.TipodeRegistro),
                    new KeyValuePair<string, string>("TipoProducto", filtros.TipoProducto),
                    new KeyValuePair<string, string>("FechaIni", filtros.FechaIni),
                    new KeyValuePair<string, string>("FechaFin", filtros.FechaFin)
                };

                var data = await _requestClient.PostRequest("/covol/api/reportes/permicionarios", form);
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
        public async Task<IActionResult> MovimientosConsolidados([FromQuery]FiltrosReporte filtros)
        {
            JObject responseData;

            try
            {
                var form = new[]
                {
                    new KeyValuePair<string, string>("RFC", filtros.RFC),
                    new KeyValuePair<string, string>("NoCRE", filtros.NoCRE),
                    new KeyValuePair<string, string>("TipodeRegistro", filtros.TipodeRegistro),
                    new KeyValuePair<string, string>("TipoProducto", filtros.TipoProducto),
                    new KeyValuePair<string, string>("FechaIni", filtros.FechaIni),
                    new KeyValuePair<string, string>("FechaFin", filtros.FechaFin)
                };

                var data = await _requestClient.PostRequest("/covol/api/reportes/movimientosconsolidados", form);
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
        public async Task<IActionResult> Reporte([FromQuery]ReporteExcel reporte)
        {
            JObject responseData;
			Logger.LogInformation("Ingresa Controlador Reporte");
            try
            {
                var form = new[]
                {
                    new KeyValuePair<string, string>("RFC", reporte.RFC),
                    new KeyValuePair<string, string>("NoCRE", reporte.NoCRE),
                    new KeyValuePair<string, string>("FechaIni", reporte.FechaIni),
                    new KeyValuePair<string, string>("FechaFin", reporte.FechaFin),
                };

                Stream data = await _requestClient.PostRequestFile("/covol/api/reportes/reporte", form);
                Logger.LogInformation("Reporte Exitoso");
                return File(data, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"Remporte{DateTime.Now.ToString("ddMMyyyy_HHmm")}.xlsx");
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
