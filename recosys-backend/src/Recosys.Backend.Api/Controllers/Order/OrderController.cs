using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Recosys.Backend.Application.Interfaces.Order;
using Recosys.Backend.Application.Interfaces.ShipRocket;
using System.Threading.Tasks;

namespace Recosys.Backend.Api.Controllers.Order
{
    [ApiController]
    [Authorize]
    [Route("api/order")]
    public class OrderController(IOrderRepository repository,IShiprocketService shiprocketService) : ControllerBase
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
    }
}
