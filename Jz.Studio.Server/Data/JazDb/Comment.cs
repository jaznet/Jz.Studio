using System;
using System.Collections.Generic;

namespace Jz.Studio.Server.Data.JazDb;

public partial class Comment
{
    public int Id { get; set; }

    public DateTime Timestamp { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string UserComment { get; set; } = null!;

    public string? Tag { get; set; }
}
