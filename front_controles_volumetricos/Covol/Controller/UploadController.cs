using Covol.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
namespace Covol.Presentacion.Controllers
{
    //[Produces("application/json")]
    [Route("covol/api/[controller]")]
    public class UploadController : ControllerBase
    {
        private readonly string urlProcesamiento;
        private readonly IRequestAsync _requestClient;
        public ILogger<UploadController> Logger { get; }

        public UploadController(IRequestAsync requestClient, ILogger<UploadController> logger)
        {
            _requestClient = requestClient;
            Logger = logger;
        }

        [HttpPost, DisableRequestSizeLimit]
        public async Task<IActionResult> UploadFile(List<IFormFile> files)
        {
            JObject responseData;
			object toto = new object();
            try
            {
                if (files.Count > 0)
                {
                    //using (var content = new MultipartFormDataContent())
                    //{

                    foreach (var file in files)
                    {
                        toto = new object();
                        var content = new MultipartFormDataContent();
                        content.Headers.ContentType.MediaType = "multipart/form-data";
                        //if (file.ContentType.Equals("text/xml") || file.ContentType.Equals("text/plain"))
                        if (file.ContentType.Equals("text/xml") || file.ContentType.Equals("application/xml") || file.ContentType.Equals("text/plain"))
                        {
                            string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                            var streamContent = new StreamContent(file.OpenReadStream());
                            streamContent.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType);
                            content.Add(streamContent, "files", fileName);
                            Logger.LogInformation(string.Format("Nombre del archivo: {0}", fileName));
                            toto = await _requestClient.PostRequest("/covol/api/upload", content);
                        }
                    }

                    return Ok(toto);
                    //}
                }
                else
                {
                    Logger.LogError("No se ha detectado archivos para procesar");
                    return BadRequest(new
                    {
                        Mensaje = "No hay archivos para procesar",
                        uri = urlProcesamiento
                    });
                }
            }
            catch (System.Exception ex)
            {
                Logger.LogError(ex.Message);

                responseData = JObject.FromObject(JsonConvert.DeserializeObject(ex.Message));
                

                if (responseData["statusHttp"].ToString() == HttpStatusCode.Unauthorized.ToString())
                {
                    return Unauthorized(responseData);
                }
                else if (responseData["statusHttp"].ToString() == HttpStatusCode.InternalServerError.ToString())
                {
                    return BadRequest(responseData);
                }
                else if (responseData["statusHttp"].ToString() == HttpStatusCode.GatewayTimeout.ToString())
                {
                    return BadRequest(responseData);
                }
                else if (responseData["statusHttp"].ToString() == HttpStatusCode.BadRequest.ToString())
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