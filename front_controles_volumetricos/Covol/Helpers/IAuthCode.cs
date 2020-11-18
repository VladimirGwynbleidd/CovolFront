namespace Covol.Helpers
{
    public interface IAuthCode
    {
        object RequestQueryStringParams(string codeVerifier = "", string code = "");
        //object RequestUserInfo();
        object RequestTokenRevoke();
    }
}
