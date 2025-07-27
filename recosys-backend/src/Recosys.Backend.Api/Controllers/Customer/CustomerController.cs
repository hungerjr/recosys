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
    [Route("api/customers")]
    public class CustomerController(ICustomerRepository repository, ICustomerAddressRepository customerAddressRepository, IMapper mapper) : ControllerBase
    {
        [HttpGet("get-all")]
        public async Task<ActionResult<IEnumerable<CustomerDetailsDto>>> GetAll()
        {
            var customers = await repository.GetAllAsync();
            return Ok(mapper.Map<IEnumerable<CustomerDetailsDto>>(customers));
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
    }
}