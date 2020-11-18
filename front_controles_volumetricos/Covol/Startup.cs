using Covol.Helpers;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Steeltoe.Discovery.Client;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Net.Http;

namespace Covol
{
    public class Startup
    {
        private readonly ILogger _logger;
        public IConfiguration Configuration { get; }
        public Startup(IConfiguration configuration, ILogger<Startup> logger)
        {
            Configuration = configuration;
            _logger = logger;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services
                .AddMvcCore()
                .AddAuthorization()
                .AddFormatterMappings()
                .AddJsonFormatters();

            _logger.LogInformation("Agregado al repositorio de servicios");

            services.AddDiscoveryClient(Configuration);
            //services.AddMvc();

            //Configurar variable de entorno para activar el servicio de OAuth
            if (!Environment.GetEnvironmentVariable("ActiveOauth").ToBool())
            {
                services.AddHttpClient<IRequestAsync, RequestService>();
            }
            else
            {
                services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
                services.AddScoped<IAuthCode, IdentityAuthCodeServer>();
                services.AddTransient<ProtectedApiBearerTokenHandler>();
                services.AddHttpClient<IRequestAsync, RequestService>()
                    .ConfigurePrimaryHttpMessageHandler(() => {
                        var clientHandler = new HttpClientHandler();
                        clientHandler.ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => { return true; };
                        return clientHandler;
                     })
                    .AddHttpMessageHandler<ProtectedApiBearerTokenHandler>();
            }

            services.Configure<RequestLocalizationOptions>(options =>
            {
                options.DefaultRequestCulture = new Microsoft.AspNetCore.Localization.RequestCulture("es-MX");
                options.SupportedCultures = new List<CultureInfo> { new CultureInfo("es-US"), new CultureInfo("es-ES") };
            });

            services.AddLogging(config =>
            {

                config.ClearProviders();

                config.AddConfiguration(Configuration.GetSection("Logging"));

                config.AddDebug();

                config.AddConsole();
            });
          
            services.Configure<KestrelServerOptions>(options =>
            {
                options.Limits.MaxRequestBodySize = null; // if don't set default value is: 30 MB
            });
          
            services.Configure<FormOptions>(o =>  // currently all set to max, configure it to your needs!
            {
                o.ValueLengthLimit = int.MaxValue;
                o.MultipartBodyLengthLimit = 60000000;
                o.MultipartBoundaryLengthLimit = int.MaxValue;
                o.MultipartHeadersCountLimit = int.MaxValue;
                o.MultipartHeadersLengthLimit = int.MaxValue;
            });
          
          	services.AddMvc().AddJsonOptions(options => {
                options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            });
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                _logger.LogInformation("Entorno de Desarrollo");
                app.UseDeveloperExceptionPage();
            }

            app.UseAuthentication();
            app.UseStaticFiles();
            app.UseMvc();

            app.UseDiscoveryClient();
          
            app.Run(async (context) =>
            {
                context.Features.Get<IHttpMaxRequestBodySizeFeature>().MaxRequestBodySize = 10 * 1024;
                System.Console.WriteLine(DateTime.Now.ToString());
                await context.Response.WriteAsync("head, body");
            });
            app.Use(async (context, next) =>
            {
                context.Features.Get<IHttpMaxRequestBodySizeFeature>().MaxRequestBodySize = null; // unlimited I guess
                await next.Invoke();
            });
        }
    }
}
