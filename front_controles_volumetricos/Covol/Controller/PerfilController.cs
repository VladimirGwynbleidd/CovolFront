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
    public class PerfilController : ControllerBase
    {
        private readonly string urlProcesamiento;
        private readonly IRequestAsync _requestClient;

        public PerfilController(IRequestAsync requestClient)
        {
            _requestClient = requestClient;
        }

        [HttpGet]
        public async Task<IActionResult> CatalogoPerfiles()
        {
            JObject responseData;
            try
            {
                var data = await _requestClient.GetRequest("/covol/api/perfil/CatalogoPerfiles");
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
        public async Task<IActionResult> ObtenerPerfil([FromQuery] Perfil perfil)
        {
            JObject responseData;
            try
            {
                var uri_string = String.IsNullOrEmpty(perfil.RFC) ? "/covol/api/perfil/obtenerPerfil" : 
                    $"/covol/api/perfil/obtenerPerfil?rfc={perfil.RFC}";
                var data = await _requestClient.GetRequest(uri_string);
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
        public async Task<IActionResult> AgregarPerfil([FromBody] Perfil perfil)
        {
            JObject responseData;

            try
            {
                var form = new[]{
                    new KeyValuePair<string, string>("IdUsuario", perfil.IdUsuario.ToString()),
                    new KeyValuePair<string, string>("IdPerfil", perfil.IdPerfil.ToString()),
                    //new KeyValuePair<string, string>("dperfil", perfil.dperfil.ToString()),
                    new KeyValuePair<string, string>("Nombre", perfil.Nombre.ToString() ?? ""),
                    new KeyValuePair<string, string>("RFC", perfil.RFC ?? ""),
                    new KeyValuePair<string, string>("carga", perfil.carga.ToString()),
                    new KeyValuePair<string, string>("catalogo", perfil.catalogo.ToString()),
                    new KeyValuePair<string, string>("cruce", perfil.cruce.ToString()),
                };

                var data = await _requestClient.PostRequest("/covol/api/perfil/agregarperfil", form);
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
        public async Task<IActionResult> ActualizarPerfil([FromBody] Perfil perfil)
        {
            JObject responseData;

            try
            {
                var form = new[]{
                        new KeyValuePair<string, string>("IdUsuario", perfil.IdUsuario.ToString()),
                        new KeyValuePair<string, string>("IdPerfil", perfil.IdPerfil.ToString()),
                        new KeyValuePair<string, string>("dperfil", perfil.dperfil.ToString()),
                        new KeyValuePair<string, string>("Nombre", perfil.Nombre.ToString() ?? ""),
                        new KeyValuePair<string, string>("RFC", perfil.RFC ?? ""),
                        new KeyValuePair<string, string>("carga", perfil.carga.ToString()),
                        new KeyValuePair<string, string>("catalogo", perfil.catalogo.ToString()),
                        new KeyValuePair<string, string>("cruce", perfil.cruce.ToString()),
                    };


                var data = await _requestClient.PutRequest("/covol/api/perfil/actualizarperfil", form);
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

        [HttpDelete]
        public async Task<IActionResult> EliminarPerfil([FromBody]Perfil perfil)
        {
            JObject responseData;

            try
            {
                var data = await _requestClient.DeleteRequest($"/covol/api/perfil/eliminarperfil?id={perfil.IdUsuario.ToString()}");
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
