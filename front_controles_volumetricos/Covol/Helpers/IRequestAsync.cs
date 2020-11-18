using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace Covol.Helpers
{
    public interface IRequestAsync
    {
        Task<object> GetRequest(string uriApi);
        Task<object> PostRequest(string uriApi, KeyValuePair<string, string>[] form);
        Task<object> PostRequest(string uriApi, HttpContent content);
        Task<Stream> PostRequestFile(string uriApi, KeyValuePair<string, string>[] form);
        Task<object> PutRequest(string uriApi, KeyValuePair<string, string>[] form);
        Task<object> DeleteRequest(string uriApi);
    }
}
