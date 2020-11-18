using Covol.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace Presentacion.Helpers
{
    public class ProtectedApiBearerClientTokenHandler : DelegatingHandler
    {
        private readonly IIdentityServerClient _identityServerClient;

        public ProtectedApiBearerClientTokenHandler(IIdentityServerClient identityServerClient)
        {
            _identityServerClient = identityServerClient ?? throw new ArgumentNullException(nameof(identityServerClient));
        }

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var token = await _identityServerClient.RequestClientCredentialsTokenAsync();
            request.SetBearerToken(token);

            return await base.SendAsync(request, cancellationToken);
        }
    }
}
