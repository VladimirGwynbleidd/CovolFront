using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace Covol.Helpers
{
    public static class ResponseDelegate
    {

        public static async Task<object> _ResponseDelegate(HttpClient client, string uri, string method = "GET", KeyValuePair<string, string>[] form = null)
        {
            HttpResponseMessage responseMessage;
            HttpContent content;
            JObject jsonObject;
            string data;

            try
            {
                switch (method)
                {
                    case "POST":
                        content = new FormUrlEncodedContent(form);
                        content.Headers.ContentType.MediaType = "application/x-www-form-urlencoded";
                        responseMessage = await client.PostAsync(uri, content);
                        break;
                    case "PUT":
                        content = new FormUrlEncodedContent(form);
                        content.Headers.ContentType.MediaType = "application/x-www-form-urlencoded";
                        responseMessage = await client.PutAsync(uri, content);
                        break;
                    case "DELETE":
                        responseMessage = await client.DeleteAsync(uri);
                        break;
                    default:
                        responseMessage = await client.GetAsync(uri, HttpCompletionOption.ResponseContentRead);
                        break;
                }

                data = await responseMessage.Content.ReadAsStringAsync();

                if (responseMessage.StatusCode == HttpStatusCode.Unauthorized)
                {
                    throw new ArgumentException(JsonConvert.SerializeObject(new
                    {
                        statusHttp = "Unauthorized",
                        Mensaje = "No se encuentra autorizado para acceder al recurso protegido."
                    }));
                }

                if (responseMessage.StatusCode == HttpStatusCode.BadRequest)
                {
                    jsonObject = JObject.FromObject(JsonConvert.DeserializeObject(data));
                    jsonObject.Add("statusHttp", "BadRequest");
                    throw new ArgumentException(JsonConvert.SerializeObject(jsonObject));
                }

                return JsonConvert.DeserializeObject<object>(data);
            }
            catch (HttpRequestException ex)
            {
                throw new HttpRequestException(JsonConvert.SerializeObject(new
                {
                    statusHttp = "InternalServerError",
                    Mensaje = ex.Message
                }));
            }
        }

        public static async Task<object> _ResponseDelegate(HttpClient client, string uri, HttpContent content)
        {
            HttpResponseMessage responseMessage;
            JObject jsonObject;
            string data;

            try
            {
                responseMessage = await client.PostAsync(uri, content);

                data = await responseMessage.Content.ReadAsStringAsync();

                if (responseMessage.StatusCode == HttpStatusCode.Unauthorized)
                {
                    throw new ArgumentException(JsonConvert.SerializeObject(new
                    {
                        statusHttp = "Unauthorized",
                        Mensaje = "No se encuentra autorizado para acceder al recurso protegido."
                    }));
                }

                if (responseMessage.StatusCode == HttpStatusCode.BadRequest)
                {
                    jsonObject = JObject.FromObject(JsonConvert.DeserializeObject(data));
                    jsonObject.Add("statusHttp", "BadRequest");
                    throw new ArgumentException(JsonConvert.SerializeObject(jsonObject));
                }

                if (responseMessage.StatusCode == HttpStatusCode.InternalServerError)
                {
                    jsonObject = JObject.FromObject(JsonConvert.DeserializeObject(data));
                    jsonObject.Add("statusHttp", "InternalServerError");
                    throw new ArgumentException(JsonConvert.SerializeObject(jsonObject));
                }

                if (responseMessage.StatusCode == HttpStatusCode.GatewayTimeout)
                {
                    jsonObject = JObject.FromObject(JsonConvert.DeserializeObject(data));
                    jsonObject.Add("statusHttp", "GatewayTimeout");
                    throw new ArgumentException(JsonConvert.SerializeObject(jsonObject));
                }

                return JsonConvert.DeserializeObject<object>(data);
            }
            catch (HttpRequestException ex)
            {
                throw new HttpRequestException(JsonConvert.SerializeObject(new
                {
                    statusHttp = "InternalServerError",
                    Mensaje = ex.Message
                }));
            }
        }

        public static async Task<Stream> _ResponseStreamDelegate(HttpClient client, string uri, KeyValuePair<string, string>[] form)
        {
            try
            {
                var content = new FormUrlEncodedContent(form);
                content.Headers.ContentType.MediaType = "application/x-www-form-urlencoded";
                var response = await client.PostAsync(uri, content);
                if (response != null)
                {
                    HttpContent contentRespose = response.Content;
                    return await contentRespose.ReadAsStreamAsync();
                }
                else
                {
                    throw new ArgumentException("Error en procesamiento", new Exception("Error en procesamiento"));
                }
            }
            catch (HttpRequestException ex)
            {
                throw new HttpRequestException(JsonConvert.SerializeObject(new
                {
                    statusHttp = "InternalServerError",
                    Mensaje = ex.Message
                }));
            }
        }
    }
}
