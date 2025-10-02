using Recosys.Backend.Application.DTOs.Shiprocket;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Recosys.Backend.Application.Interfaces.Order
{
    public interface IOrderRepository
    {
        Task<int> BulkInsertOrdersAsync(List<ShiprocketOrderDto> orderDtos);
    }
}
