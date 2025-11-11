using Recosys.Backend.Application.Common.Models;
using Recosys.Backend.Application.DTOs.Order;
using Recosys.Backend.Application.DTOs.Shiprocket;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Recosys.Backend.Application.Interfaces.Order
{
    public interface IOrderRepository
    {
        Task<PagedResult<OrderDetailsDto>> GetPagedOrdersAsync(int pageNumber, int pageSize,
                             string? sortBy, string? sortOrder,
                             string? channelOrderId, string? paymentMethod, string? statusDescription);
        Task<OrderDetailsDto?> GetOrderByIdAsync(int id);
        Task<int> CreateOrderAsync(OrderDetailsDto dto);
        Task<bool> UpdateOrderAsync(int id, OrderDetailsDto dto);
        Task<bool> DeleteOrderAsync(int id);
        Task<(bool exists, AwbCheckDto? order)> CheckAwbDetailsAsync(string awb);
        Task<int> BulkInsertOrdersAsync(List<ShiprocketOrderDto> orderDtos);
    }
}
