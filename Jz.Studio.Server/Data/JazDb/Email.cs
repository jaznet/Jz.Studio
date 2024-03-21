using System;
using System.Collections.Generic;

namespace Jz.Studio.Server.Data.JazDb;

public partial class Email
{
    public int Id { get; set; }

    public DateTime Timestamp { get; set; }

    public string From { get; set; } = null!;

    public string To { get; set; } = null!;

    public string Subject { get; set; } = null!;

    public string Message { get; set; } = null!;
}
