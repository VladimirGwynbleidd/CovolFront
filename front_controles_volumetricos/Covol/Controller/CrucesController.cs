using Covol.Helpers;
using Covol.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using WebApiCore.Models;

namespace Covol.Presentacion.Controller
{
    [Produces("application/json")]
    [Route("covol/api/[controller]/[action]")]
    public class CrucesController : ControllerBase
    {
        private readonly string urlProcesamiento;
        private readonly IRequestAsync _requestClient;

        public CrucesController(IRequestAsync requestClient)
        {
            _requestClient = requestClient;

        }

        [HttpGet]
        public async Task<IActionResult> Reporte([FromQuery]ReporteExcel reporte)
        {
            JObject responseData;

            try
            {
                var form = new[]
                {
                    new KeyValuePair<string, string>("RFC", reporte.RFC),
                    new KeyValuePair<string, string>("NoCRE", reporte.NoCRE),
                    new KeyValuePair<string, string>("FechaIni", reporte.FechaIni),
                    new KeyValuePair<string, string>("FechaFin", reporte.FechaFin),
                };

                Stream data = await _requestClient.PostRequestFile("/covol/api/cruces/reporte", form);
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

        [HttpGet]
        public async Task<IActionResult> Permicionarios([FromQuery]int estatus)
        {
            JObject responseData;
            try
            {
                var form = new[]
                {
                    new KeyValuePair<string, string>("estatus", estatus.ToString())
                };

                var data = await _requestClient.PostRequest("/covol/api/cruces/permicionarios", form);

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
        public async Task<IActionResult> Consolidados([FromQuery]string rfc, [FromQuery]string numeroPermisoCRE, [FromQuery]int estatus)
        {
            JObject responseData;

            try
            {
                var form = new[]
                {
                    new KeyValuePair<string, string>("rfc", rfc),
                    new KeyValuePair<string, string>("numeroPermisoCRE", numeroPermisoCRE),
                    new KeyValuePair<string, string>("estatus", estatus.ToString())
                };

                var data = await _requestClient.PostRequest("/covol/api/cruces/consolidados", form);

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
        public async Task<object> ConsolidadoMaestro([FromQuery]SolicitudPeriodoConsolidado solicitud)
        {
            JObject responseData;

            try
            {
                var form = new[]
                {
                    new KeyValuePair<string, string>("RFC", solicitud.RFC),
                    new KeyValuePair<string, string>("NoCRE", solicitud.NoCRE),
                    new KeyValuePair<string, string>("FechaIni", solicitud.FechaIni),
                    new KeyValuePair<string, string>("FechaFin", solicitud.FechaIni)
                };

                var data = await _requestClient.PostRequest("/covol/api/cruces/consolidadoMaestro", form);

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
        public async Task<IActionResult> VerificarArchivosProcesados()
        {
            JObject responseData;
            try
            {
                var ArchivosPorSubir = Request.Cookies["ArchivosPorSubir"];
                var ArchivoCompletosAplicativo = Request.Cookies["ArchivoCompletos"];
                var ArchivosCompletos = Convert.ToInt32(ArchivoCompletosAplicativo) + Convert.ToInt32(ArchivosPorSubir);

                if (Convert.ToInt32(ArchivosPorSubir) == 0 || ArchivosPorSubir == null || ArchivosPorSubir == string.Empty)
                {
                    return Ok();
                }
                else
                {
                    int totalEstadisticas = 0;
                    int totalRepetidos = 0;
                    int i = 0;
                    do
                    {
                        totalEstadisticas = await ObtenerSumaEstadisticos();
                        totalRepetidos = totalEstadisticas;
                        if (totalEstadisticas < Convert.ToInt32(ArchivosCompletos))
                        {
                            Thread.Sleep(4000);

                            if (totalRepetidos == totalEstadisticas)
                            {
                                i++;
                            }

                            if (i > 9)
                            {
                                Thread.CurrentThread.Interrupt();
                                    
                                return Ok("Se terminaron de procesar los archivos");
                            }
                        }
                    } while (totalEstadisticas < Convert.ToInt32(ArchivosCompletos));

                    return Ok("Se terminaron de procesar los archivos");
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


        private async Task<int> ObtenerSumaEstadisticos()
        {
            var form = new[]
               {
                    new KeyValuePair<string, string>("", string.Empty)
                };

            var data = await _requestClient.PostRequest("/covol/api/cruces/VerificarArchivosProcesados", form);

            var result = JsonConvert.SerializeObject(data);
            List<Estadisticas> lstEstadisticas = JsonConvert.DeserializeObject<List<Estadisticas>>(result);
            int totalEstadisticas = lstEstadisticas.Sum(item => item.REGISTROS);
            return totalEstadisticas;
        }

        public static Task ExecuteTask()
        {
            var tcs = new TaskCompletionSource<int>();
            Task t1 = tcs.Task;
            Task.Factory.StartNew(() =>
            {
                try
                {
                    ExecuteLongRunningTask(10000);
                    tcs.SetResult(1);
                }
                catch (Exception ex)
                {
                    tcs.SetException(ex);
                }
            });
            return tcs.Task;

        }

        public static void ExecuteLongRunningTask(int millis)
        {
            Thread.Sleep(millis);
            Console.WriteLine("Executed");
        }
    }
}
