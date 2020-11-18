using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Net;

namespace Covol
{
    public static class Program
    {
        static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();
            BuildWebHost(args).Run();
        }
        public static IWebHost BuildWebHost(string[] args)
        {
            return WebHost.CreateDefaultBuilder(args)
            .UseIISIntegration()
            .UseStartup<Startup>()
            .UseKestrel(o =>
            {
                Console.WriteLine("Iniciando kestrel");
                o.Limits.KeepAliveTimeout = TimeSpan.FromMinutes(5);
                Console.WriteLine($"Request Timeout antes: {o.Limits.RequestHeadersTimeout.ToString()}");
                o.Limits.RequestHeadersTimeout = TimeSpan.FromMinutes(5);
                Console.WriteLine($"Request Timeout después: {o.Limits.RequestHeadersTimeout.ToString()}");
                o.Limits.MaxRequestBodySize = 10 * 1024;
                o.Limits.MinRequestBodyDataRate =
                new MinDataRate(bytesPerSecond: 100,
                gracePeriod: TimeSpan.FromSeconds(10));
                o.Limits.MinResponseDataRate =
                    new MinDataRate(bytesPerSecond: 100,
                        gracePeriod: TimeSpan.FromSeconds(10));
                o.Listen(IPAddress.Loopback, 5000);
            })
            .Build();
        }
        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
            .ConfigureAppConfiguration((hostingContext, config) =>
            {
                config.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
            })
            .ConfigureLogging((Action<WebHostBuilderContext, ILoggingBuilder>)((hostingContext, logging) =>
            {
                logging.AddConfiguration((IConfiguration)hostingContext.Configuration.GetSection("Logging"));
                logging.AddConsole();
                logging.AddDebug();
            }))
            .UseStartup<Startup>();

    }
}
