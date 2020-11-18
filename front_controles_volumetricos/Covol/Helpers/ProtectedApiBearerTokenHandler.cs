using Microsoft.AspNetCore.Http;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace Covol.Helpers
{
    public class ProtectedApiBearerTokenHandler : DelegatingHandler
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        public ProtectedApiBearerTokenHandler(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var token = _httpContextAccessor.HttpContext.Request.Cookies["token_covol"].ToString();

            if (!string.IsNullOrEmpty(token))
            {
                request.SetBearerToken(token);
            }
            
            return await base.SendAsync(request, cancellationToken);
        }
    }
}
