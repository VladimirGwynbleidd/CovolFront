using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

namespace Covol.Helpers
{
    public class RequestService : IRequestAsync
    {
        public HttpClient Client { get; private set; }

        public RequestService(HttpClient client)
        {
            client.BaseAddress = new Uri(Environment.GetEnvironmentVariable("SERVER_URL_ZUUL"));
            client.DefaultRequestHeaders.Add("Accept", "application/json");
            client.Timeout = TimeSpan.FromHours(2);
            Client = client;
        }

        public async Task<object> GetRequest(string uriApi)
        {
            Func<
                HttpClient,
                string,
                string,
                KeyValuePair<string, string>[],
                Task<object>> response = ResponseDelegate._ResponseDelegate;

            return await response(Client, uriApi, "GET", null);
        }

        public async Task<object> PostRequest(string uriApi, KeyValuePair<string, string>[] form)
        {
            Func<
                HttpClient,
                string,
                string,
                KeyValuePair<string, string>[],
                Task<object>> response = ResponseDelegate._ResponseDelegate;

            return await response(Client, uriApi, "POST", form);
        }

        public async Task<object> PostRequest(string uriApi, HttpContent content)
        {
            Func<
                HttpClient,
                string,
                HttpContent,
                Task<object>> response = ResponseDelegate._ResponseDelegate;

            return await response(Client, uriApi, content);
        }

        public async Task<Stream> PostRequestFile(string uriApi, KeyValuePair<string, string>[] form)
        {
            Func<
                HttpClient,
                string,
                KeyValuePair<string, string>[],
                Task<Stream>> response = ResponseDelegate._ResponseStreamDelegate;

            return await response(Client, uriApi, form);
        }

        public async Task<object> PutRequest(string uriApi, KeyValuePair<string, string>[] form)
        {
            Func<
                HttpClient,
                string,
                string,
                KeyValuePair<string, string>[],
                Task<object>> response = ResponseDelegate._ResponseDelegate;

            return await response(Client, uriApi, "PUT", form);
        }

        public async Task<object> DeleteRequest(string uriApi)
        {
            Func<
                HttpClient,
                string,
                string,
                KeyValuePair<string, string>[],
                Task<object>> response = ResponseDelegate._ResponseDelegate;

            return await response(Client, uriApi, "DELETE", null);
        }
    }
}
