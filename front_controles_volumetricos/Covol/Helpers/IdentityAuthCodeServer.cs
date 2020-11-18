using IdentityModel;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Security.Cryptography;
using System.Text;

namespace Covol.Helpers
{
    public class IdentityAuthCodeServer : IAuthCode
    {
        private readonly ILogger<IdentityAuthCodeServer> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public IdentityAuthCodeServer(ILogger<IdentityAuthCodeServer> logger,
                                        IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _httpContextAccessor = httpContextAccessor;
        }

        public object RequestQueryStringParams(string codeVerifier = "", string code = "")
        {
            var codeVerifierStr = String.IsNullOrEmpty(codeVerifier) ? CryptoRandom.CreateUniqueId(32) : codeVerifier;
            string codeChallenge;
            string queryString;
            string strUri;
            string nam;

            codeChallenge = String.IsNullOrEmpty(codeVerifier) ? getSHA256(codeVerifierStr) : "";
            queryString = code == "" ? $"client_id={Environment.GetEnvironmentVariable("ClientId")}" +
                "&resourceServer=covol" +
                "&response_type=code" +
                $"&state={codeChallenge}" +
                $"&redirect_uri={Environment.GetEnvironmentVariable("redirect_uriAuth")}" +
                $"&scope=covol_perfil" +
                $"&code_challenge={codeChallenge}" +
                $"&code_challenge_method=S256" :
                $"client_id={Environment.GetEnvironmentVariable("ClientId")}" +
                "&resourceServer=covol" +
                "&grant_type=authorization_code" +
                $"&redirect_uri={Environment.GetEnvironmentVariable("redirect_uriAuth")}" +
                $"&code={code}" +
                $"&code_verifier={codeVerifierStr}";
            nam = String.IsNullOrEmpty(codeVerifier) ? "/nidp/oauth/nam/authz" : "/nidp/oauth/nam/token";

            strUri = $"{Environment.GetEnvironmentVariable("OauthUri")}{nam}?{queryString}";

            return JsonConvert.SerializeObject(new
            {
                uriAuth = strUri,
                codeVerifier = codeVerifierStr
            });
        }

        public object RequestTokenRevoke()
        {
            string strUri = Environment.GetEnvironmentVariable("OauthUri");
            string nam = "/nidp/oauth/nam/revoke";


            return $"{strUri}{nam}";
        }

        private string getSHA256(string codeVerifier)
        {
            using (var sha256 = SHA256.Create())
            {
                byte[] challengeBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(codeVerifier));
                return Base64Url.Encode(challengeBytes);
            }
        }
    }
}
