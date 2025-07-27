using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Recosys.Backend.Application.DTOs.Customer;
using Recosys.Backend.Application.Interfaces.Customer;
using Recosys.Backend.Domain.Entities.Customer;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Recosys.Backend.Api.Controllers.Customer
{
    [ApiController]
    [Route("api/addresses")]
    public class AddressController(ICustomerAddressRepository repository, IMapper mapper) : ControllerBase
    {
        [HttpGet("by-customer/{customerId}")]
        public async Task<ActionResult<IEnumerable<CustomerAddressDto>>> GetByCustomer(int customerId)
        {
            var addresses = await repository.GetAllAsync(customerId);
            return Ok(mapper.Map<IEnumerable<CustomerAddressDto>>(addresses));
        }

        [HttpGet("{addressId}")]
        public async Task<ActionResult<CustomerAddressDto>> GetById(int addressId)
        {
            var address = await repository.GetByIdAsync(addressId);
            if (address == null) return NotFound();

            return Ok(mapper.Map<CustomerAddressDto>(address));
        }

        [HttpGet("default/{customerId}")]
        public async Task<ActionResult<CustomerAddressDto>> GetDefault(int customerId)
        {
            var defaultAddress = await repository.GetDefaultAddressAsync(customerId);
            if (defaultAddress == null) return NotFound();

            return Ok(mapper.Map<CustomerAddressDto>(defaultAddress));
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] CreateCustomerAddressDto dto)
        {
            var address = mapper.Map<CustomerAddress>(dto);
            address.CreatedAt = address.UpdatedAt = DateTime.UtcNow;

            await repository.AddAsync(address);
            await repository.SaveChangesAsync();

            return Ok(new
            {
                message = "Address created successfully",
                addressId = address.Id
            });
        }

        [HttpPut("{addressId}")]
        public async Task<ActionResult> Update(int addressId, [FromBody] UpdateCustomerAddressDto dto)
        {
            var existing = await repository.GetByIdAsync(addressId);
            if (existing == null) return NotFound();

            mapper.Map(dto, existing);
            existing.UpdatedAt = DateTime.UtcNow;

            await repository.UpdateAsync(existing);
            await repository.SaveChangesAsync();

            return Ok(new
            {
                message = "Address updated successfully",
                addressId
            });
        }

        [HttpDelete("{addressId}")]
        public async Task<ActionResult> Delete(int addressId)
        {
            var existing = await repository.GetByIdAsync(addressId);
            if (existing == null) return NotFound();

            await repository.DeleteAsync(addressId);
            await repository.SaveChangesAsync();

            return Ok(new
            {
                message = "Address deleted successfully"
            });
        }

        [HttpPut("set-default/{customerId}/{addressId}")]
        public async Task<ActionResult> SetDefault(int customerId, int addressId)
        {
            var success = await repository.SetDefaultAddressAsync(addressId, customerId);
            if (!success)
            {
                return BadRequest(new
                {
                    message = "Failed to set default address. Check if address belongs to customer."
                });
            }

            await repository.SaveChangesAsync();

            return Ok(new
            {
                message = "Default address set successfully",
                addressId
            });
        }
    }
}
