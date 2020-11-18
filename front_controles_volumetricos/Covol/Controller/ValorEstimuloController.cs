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
    public class ValorEstimuloController : ControllerBase
    {
        private readonly string urlProcesamiento;
        private readonly IRequestAsync _requestClient;

        public ValorEstimuloController(IRequestAsync requestClient)
        {
            _requestClient = requestClient;
        }

        [HttpGet]
        public async Task<IActionResult> Permisionarios(string estado, string zona)
        {
            JObject responseData;

            try
            {
                if (estado == "Baja California Norte")
                {
                    estado = "Baja California";
                }
                var form = new[]
                {
                    new KeyValuePair<string, string>("estado", estado),
                    new KeyValuePair<string, string>("zona", zona)
                };

                var data = await _requestClient.PostRequest("/covol/api/valorestimulo/permisionarios", form);
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
        public async Task<IActionResult> EstacionesServicio(string estado, string rfc)
        {
            JObject responseData;

            try
            {
                var form = new[]
                 {
                    new KeyValuePair<string, string>("estado", estado),
                    new KeyValuePair<string, string>("rfc",rfc),
                };

                var data = await _requestClient.PostRequest("/covol/api/valorestimulo/estacionesservicio", form);
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
        public async Task<IActionResult> Zonas(string zona)
        {
            JObject responseData;

            try
            {
                var form = new[]
                 {
                    new KeyValuePair<string, string>("zona", zona)
                };

                var data = await _requestClient.PostRequest("/covol/api/valorestimulo/zonas", form);
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

        [HttpPut]
        public async Task<IActionResult> ActualizarValorEstimulo([FromBody] Estimulo estimulo)
        {
            JObject responseData;
            try
            {
                TryValidateModel(estimulo);

                if (ModelState.IsValid)
                {
                    var form = new[]
                    {
                        new KeyValuePair<string, string>("IdValorEstimulo", estimulo.IdValorEstimulo.ToString()),
                        new KeyValuePair<string, string>("valorMagna", estimulo.valorMagna.ToString()),
                        new KeyValuePair<string, string>("valorPremium", estimulo.valorPremium.ToString()),
                    };

                    var data = await _requestClient.PutRequest("/covol/api/valorestimulo/actualizarvalorestimulo", form);
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
