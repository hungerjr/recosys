using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Recosys.Backend.Application.Common.Models;
using Recosys.Backend.Application.DTOs.Customer;
using Recosys.Backend.Application.Interfaces.Customer;
using Recosys.Backend.Application.Interfaces.ShipRocket;
using Recosys.Backend.Domain.Entities.Customer;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Recosys.Backend.Api.Controllers.Customer
{
    [ApiController]
    [Authorize]
    [Route("api/customers")]
    public class CustomerController(ICustomerRepository repository, ICustomerAddressRepository customerAddressRepository,
        IMapper mapper, IShiprocketService shiprocketService) : ControllerBase
    {
        [HttpGet("get-all")]
        public async Task<ActionResult<PagedResult<CustomerDetailsDto>>> GetAll(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string sortBy = "id",
            [FromQuery] string sortOrder = "asc",
            [FromQuery] string? nameFilter = null,
            [FromQuery] string? emailFilter = null,
            [FromQuery] string? phoneFilter = null)
        {
            var pagedResult = await repository.GetPagedWithDefaultAddressAsync(
                pageNumber, pageSize, sortBy, sortOrder,
                nameFilter, emailFilter, phoneFilter
            );

            var mappedItems = mapper.Map<IEnumerable<CustomerDetailsDto>>(pagedResult.Items);
       
            var result = new PagedResult<CustomerDetailsDto>(
                mappedItems,
                pagedResult.TotalCount,
                pagedResult.PageNumber,
                pagedResult.PageSize
            );

            return Ok(result);
        }

        [HttpGet("details/{customerId}")]
        public async Task<ActionResult<CustomerDetailsDto>> GetById(int customerId)
        {
            var customer = await repository.GetByIdAsync(customerId);
            if (customer == null) return NotFound();
            return Ok(mapper.Map<CustomerDetailsDto>(customer));
        }

        [HttpPost("register")]
        public async Task<ActionResult> Create([FromBody] CreateCustomerDetailsDto dto)
        {
            // Check if customer already exists
            var existing = await repository.FindByEmailOrPhoneAsync(dto.Email, dto.Phone);
            if (existing != null)
            {
                return Conflict(new
                {
                    message = "A customer with the same email or phone already exists.",
                    customerId = existing.Id
                });
            }

            var customer = mapper.Map<CustomerDetails>(dto);
            customer.CreatedAt = customer.UpdatedAt = DateTime.UtcNow;

            await repository.AddAsync(customer);
            await repository.SaveChangesAsync();

            if (dto.Address is not null)
            {
                var address = mapper.Map<CustomerAddress>(dto.Address);
                address.CustomerId = customer.Id;
                address.IsDefault = true;

                await customerAddressRepository.AddAsync(address);
            }

            return Ok(new
            {
                message = "Customer created successfully",
                customerId = customer.Id
            });
        }

        [HttpPut("update/{customerId}")]
        public async Task<ActionResult> Update(int customerId, [FromBody] UpdateCustomerDetailsDto dto)
        {
            if (customerId != dto.Id) return BadRequest();

            var customer = await repository.GetByIdAsync(customerId);
            if (customer == null) return NotFound();

            mapper.Map(dto, customer);
            customer.UpdatedAt = DateTime.UtcNow;

            await repository.UpdateAsync(customer);
            await repository.SaveChangesAsync();

            return Ok(new
            {
                message = "Customer details updated successfully",
                customerId = customer.Id
            });
        }

        [HttpDelete("remove/{customerId}")]
        public async Task<ActionResult> Delete(int customerId)
        {
            var existing = await repository.GetByIdAsync(customerId);
            if (existing == null) return NotFound();

            await repository.DeleteAsync(customerId);
            await repository.SaveChangesAsync();

            return Ok(new
            {
                message = "Customer details deleted successfully",
            });
        }

        [HttpPost("sync-shiprocket-customers")]
        public async Task<IActionResult> SyncShiprocketCustomers()
        {
            var shiprocketCustomers = await shiprocketService.FetchAllShiprocketCustomersAsync();

            var (insertedCount, skippedFromJson, skippedFromDb) = await repository.BulkInsertCustomersAsync(shiprocketCustomers);

            return Ok(new
            {
                Inserted = insertedCount,
                SkippedDueToJsonDuplicates = skippedFromJson,
                SkippedBecauseAlreadyExistInDb = skippedFromDb
            });
        }
    }
}