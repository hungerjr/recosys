using Recosys.Backend.Application.DTOs.Customer;
using Recosys.Backend.Application.DTOs.Shiprocket;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Recosys.Backend.Application.Interfaces.ShipRocket
{
    public interface IShiprocketService
    {
        Task<List<ShiprocketCustomerDto>> FetchAllShiprocketCustomersAsync();

        Task<List<ShiprocketOrderDto>> FetchOrdersAsync();
    }
}
