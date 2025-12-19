namespace Waffle.Core.Foundations.Models;

/// <summary>
/// Represents the result of an identity operation.
/// </summary>
public class TResult
{
    /// <summary>
    /// Flag indicating whether if the operation succeeded or not.
    /// </summary>
    /// <value>True if the operation succeeded, otherwise false.</value>
    public bool Succeeded { get; protected set; }
    private static readonly TResult _success = new() { Succeeded = true };
    private static string _message = string.Empty;
    private object? _data;
    public string Message => _message;
    public object? Data => _data;

    /// <summary>
    /// Returns an <see cref="TResult"/> indicating a successful identity operation.
    /// </summary>
    /// <returns>An <see cref="TResult"/> indicating a successful operation.</returns>
    public static TResult Success => _success;

    /// <summary>
    /// Creates an <see cref="TResult"/> indicating a failed identity operation, with a list of <paramref name="message"/> if applicable.
    /// </summary>
    /// <param name="message">An optional array of <see cref="Message"/>s which caused the operation to fail.</param>
    /// <returns>An <see cref="TResult"/> indicating a failed identity operation, with a list of <paramref name="message"/> if applicable.</returns>
    public static TResult Failed(string message)
    {
        var result = new TResult { Succeeded = false };
        if (!string.IsNullOrEmpty(message))
        {
            _message = message;
        }
        return result;
    }

    public static TResult DuplicateRecord => Failed("Duplicate record exists.");

    public static TResult Ok(object? data) => new() { _data = data, Succeeded = true };
}

public class TResult<T>
{
    /// <summary>
    /// Flag indicating whether if the operation succeeded or not.
    /// </summary>
    /// <value>True if the operation succeeded, otherwise false.</value>
    public bool Succeeded { get; protected set; }
    private static readonly TResult<T> _success = new() { Succeeded = true };
    private static string _message = string.Empty;
    private T? _data;
    public string Message => _message;
    public T? Data => _data;

    /// <summary>
    /// Returns an <see cref="TResult"/> indicating a successful identity operation.
    /// </summary>
    /// <returns>An <see cref="TResult"/> indicating a successful operation.</returns>
    public static TResult<T> Success => _success;

    /// <summary>
    /// Creates an <see cref="TResult"/> indicating a failed identity operation, with a list of <paramref name="message"/> if applicable.
    /// </summary>
    /// <param name="message">An optional array of <see cref="Message"/>s which caused the operation to fail.</param>
    /// <returns>An <see cref="TResult"/> indicating a failed identity operation, with a list of <paramref name="message"/> if applicable.</returns>
    public static TResult<T> Failed(string message)
    {
        var result = new TResult<T> { Succeeded = false };
        if (!string.IsNullOrEmpty(message))
        {
            _message = message;
        }
        return result;
    }

    public static TResult<T> Ok(T? data) => new() { _data = data, Succeeded = true };
}    