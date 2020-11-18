using Covol.Helpers;
using Covol.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Threading.Tasks;

namespace Covol.Controller
{
    [Route("covol/[controller]/[action]")]
    [ApiController]
    public class OauthClientController : ControllerBase
    {
        private readonly IAuthCode _authCode;

        public OauthClientController(IAuthCode authCode)
        {
            _authCode = authCode;
        }

        [HttpPost]
        public IActionResult AuthToken([FromQuery] string code)
        {
            var strRedirectUriAuth = JObject.FromObject(JsonConvert.DeserializeObject(_authCode.RequestQueryStringParams(Request.Cookies["codeVerifier"].ToString(), code).ToString()));
            return RedirectPreserveMethod(strRedirectUriAuth["uriAuth"].ToString());
        }

        [HttpGet]
        public IActionResult AuthCodeState()
        {
            var strRedirectUriAuth = JObject.FromObject(JsonConvert.DeserializeObject(_authCode.RequestQueryStringParams().ToString()));
            //Response.Cookies.Append("code", strRedirectUriAuth["code"].ToString());
            Response.Cookies.Append("codeVerifier", strRedirectUriAuth["codeVerifier"].ToString());
            return Redirect(strRedirectUriAuth["uriAuth"].ToString());
        }

        [HttpGet]
        public IActionResult AuthLogout()
        {
            Response.Cookies.Delete("codeVerifier");
            Response.Cookies.Delete("token_covol");
            return Redirect(Environment.GetEnvironmentVariable("COVOL_REDIRECT_LOGOUT"));
        }

        [HttpPost]
        public IActionResult AuthRevokeToken()
        {
            return RedirectPreserveMethod($"{Environment.GetEnvironmentVariable("OauthUri")}/nidp/oauth/nam/revoke");
        }
    }
}