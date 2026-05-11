using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JZ.Studio.DataManager.Core.contracts
{
	public interface IEtlJob {
		string Name { get; }
		Task RunAsync(CancellationToken cancellationToken);
	}


}
