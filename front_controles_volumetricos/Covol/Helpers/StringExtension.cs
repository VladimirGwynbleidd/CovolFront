using System.Globalization;
using System.Text.RegularExpressions;
namespace System
{
    public static class StringExtension
    {
        public static string TrimAndReduce(this string str)
        {
            return str.ConvertWhitespacesToSingleSpaces().Trim();
        }
        public static string ConvertWhitespacesToSingleSpaces(this string value)
        {
            return Regex.Replace(value, "\\s+", " ");
        }
        public static int ToInt(this string value)
        {
            int.TryParse(value, out int result);
            return result;
        }
        public static bool ToBool(this string value)
        {
            bool.TryParse(value, out bool result);
            return result;
        }
        public static float ToFloat(this string value)
        {
            float.TryParse(value, out float result);
            return result;
        }
        public static double ToDouble(this string value)
        {
            double.TryParse(value, out double result);
            return result;
        }
        public static decimal ToDecimal(this string value)
        {
            decimal.TryParse(value, out decimal result);
            return result;
        }
        public static DateTime ToDateTime(this string value)
        {
            if (!DateTime.TryParse(value, CultureInfo.CurrentCulture, DateTimeStyles.None, out DateTime result))
            {
                result = DateTime.Today;
            }
            return result;
        }
    }
}
