using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Recosys.Backend.Application.Common.Models;
using Recosys.Backend.Application.DTOs.Order;
using Recosys.Backend.Application.Interfaces.Order;
using Recosys.Backend.Application.Interfaces.ShipRocket;
using Recosys.Backend.Infrastructure.Repositories.Order;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Recosys.Backend.Api.Controllers.Order
{
    [ApiController]
    //[Authorize]
    [Route("api/order")]
    public class OrderController(IOrderRepository repository,IShiprocketService shiprocketService, IMapper mapper) : ControllerBase
    {

        [HttpPost("sync-shiprocket-orders")]
        public async Task<IActionResult> SyncShiprocketOrders()
        {
            var shiprocketOrders = await shiprocketService.FetchOrdersAsync();

            var insertedCount = await repository.BulkInsertOrdersAsync(shiprocketOrders);

            return Ok(new
            {
                Inserted = insertedCount
            });
        }

        [HttpGet("get-all")]
        public async Task<ActionResult<PagedResult<OrderDetailsDto>>> GetAllOrders(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 15,
            [FromQuery] string sortBy = "createdAt",
            [FromQuery] string sortOrder = "asc",
            [FromQuery] string? channelOrderId = null,
            [FromQuery] string? AWB = null,
            [FromQuery] string? statusDescription = null)
        {
            var pagedResult = await repository.GetPagedOrdersAsync(
                pageNumber, pageSize, sortBy, sortOrder, channelOrderId, AWB, statusDescription);

            var mappedItems = mapper.Map<IEnumerable<OrderDetailsDto>>(pagedResult.Items);

            var result = new PagedResult<OrderDetailsDto>(
                mappedItems,
                pagedResult.TotalCount,
                pagedResult.PageNumber,
                pagedResult.PageSize
            );

            return Ok(pagedResult);
        }

        [HttpGet("check-awb")]
        public async Task<IActionResult> CheckAwb([FromQuery] string awb)
        {
            if (string.IsNullOrWhiteSpace(awb))
                return BadRequest(new { message = "AWB is required" });

            var (exists, order) = await repository.CheckAwbDetailsAsync(awb);

            if (!exists)
                return Ok(new { exists = false });

            return Ok(new
            {
                exists = true,
                order
            });
        }


    }
}
