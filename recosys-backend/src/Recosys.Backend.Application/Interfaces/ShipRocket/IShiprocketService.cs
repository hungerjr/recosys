using Recosys.Backend.Application.DTOs.Customer;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Recosys.Backend.Application.Interfaces.ShipRocket
{
    public interface IShiprocketService
    {
        Task<List<ShiprocketCustomerDto>> FetchAllShiprocketCustomersAsync();
    }
}
