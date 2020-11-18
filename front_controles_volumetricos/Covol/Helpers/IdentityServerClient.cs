using IdentityModel;
using IdentityModel.Client;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Covol.Helpers
{
    public class IdentityServerClient : IIdentityServerClient
    {
        private readonly HttpClient _httpClient;
        private readonly ClientCredentialsTokenRequest _tokenRequest;
        private readonly ILogger<IdentityServerClient> _logger;

        public IdentityServerClient(
            HttpClient httpClient,
            ClientCredentialsTokenRequest tokenRequest,
            ILogger<IdentityServerClient> logger)
        {
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
            _tokenRequest = tokenRequest ?? throw new ArgumentNullException(nameof(tokenRequest));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<string> RequestClientCredentialsTokenAsync()
        {
            // request the access token token
            var tokenResponse = await _httpClient.RequestClientCredentialsTokenAsync(_tokenRequest);

            if (tokenResponse.IsError)
            {
                _logger.LogError(tokenResponse.Error);
                throw new ArgumentException(JsonConvert.SerializeObject(new
                {
                    statusHttp = "InternalServerError",
                    Mensaje = tokenResponse.ErrorDescription,
                    uriOauth = Environment.GetEnvironmentVariable("OauthUri")
                }));

            }

            return tokenResponse.AccessToken;
        }
    }
}
