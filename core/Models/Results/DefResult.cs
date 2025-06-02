using Microsoft.AspNetCore.Identity;

namespace Waffle.Models.Result;

/// <summary>
/// Represents the result of an identity operation.
/// </summary>
public class DefResult
{
    /// <summary>
    /// Flag indicating whether if the operation succeeded or not.
    /// </summary>
    /// <value>True if the operation succeeded, otherwise false.</value>
    public bool Succeeded { get; protected set; }
    private static readonly DefResult _success = new() { Succeeded = true };
    private static string _message = string.Empty;
    private object? _data;
    public string Message => _message;
    public object? Data => _data;

    /// <summary>
    /// Returns an <see cref="DefResult"/> indicating a successful identity operation.
    /// </summary>
    /// <returns>An <see cref="DefResult"/> indicating a successful operation.</returns>
    public static DefResult Success => _success;

    /// <summary>
    /// Creates an <see cref="DefResult"/> indicating a failed identity operation, with a list of <paramref name="message"/> if applicable.
    /// </summary>
    /// <param name="message">An optional array of <see cref="Message"/>s which caused the operation to fail.</param>
    /// <returns>An <see cref="DefResult"/> indicating a failed identity operation, with a list of <paramref name="message"/> if applicable.</returns>
    public static DefResult Failed(string message)
    {
        var result = new DefResult { Succeeded = false };
        if (!string.IsNullOrEmpty(message))
        {
            _message = message;
        }
        return result;
    }

    public static DefResult Ok(object? data) => new() { _data = data, Succeeded = true };
}
