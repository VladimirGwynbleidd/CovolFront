using Newtonsoft.Json.Linq;
using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace Covol.Helpers
{
    public class ProtectedApiBearerAuthTokenHandler : DelegatingHandler
    {
        private readonly IAuthCode _identityAuthCode;

        public ProtectedApiBearerAuthTokenHandler(IAuthCode identityAuthCode)
        {
            _identityAuthCode = identityAuthCode ?? throw new ArgumentNullException(nameof(identityAuthCode));
        }

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            HttpResponseMessage response;
            HttpClient client = new HttpClient();
            string data;
            string token;
            JObject jdata;
           // var requestAuthCode = await _identityAuthCode.RequestGetAuthCodeAsync();

            response = await client.GetAsync("");
            data = await response.Content.ReadAsStringAsync();
            jdata = JObject.FromObject(data);
            token = jdata["token"].ToString();

            request.SetBearerToken(token);

            // Proceed calling the inner handler, that will actually send the request
            // to our protected api
            return await base.SendAsync(request, cancellationToken);
        }
    }
}
