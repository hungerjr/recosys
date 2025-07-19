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
    public class CustomerController(ICustomerRepository repository, IMapper mapper) : ControllerBase
    {
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<CustomerDetailsDto>>> GetAllCustomers()
        {
            var customers = await repository.GetAllAsync();
            var dtoList = mapper.Map<IEnumerable<CustomerDetailsDto>>(customers);
            return Ok(dtoList);
        }

        [HttpPost("get-by-id")]
        public async Task<ActionResult<CustomerDetailsDto>> GetById([FromBody] IdRequest request)
        {
            var customer = await repository.GetByIdAsync(request.Id);
            if (customer == null) return NotFound();

            return Ok(mapper.Map<CustomerDetailsDto>(customer));
        }


        [HttpPost("create")]
        public async Task<ActionResult> CreateCustomer([FromBody] CreateCustomerDetailsDto dto)
        {
            var customer = mapper.Map<CustomerDetails>(dto);
            customer.CreatedAt = customer.UpdatedAt = DateTime.UtcNow;

            await repository.AddAsync(customer);
            await repository.SaveChangesAsync();

            return Ok(new { Message = "Customer created successfully" });
        }

        [HttpPost("update")]
        public async Task<ActionResult> UpdateCustomer([FromBody] UpdateCustomerDetailsDto dto)
        {
            var customer = await repository.GetByIdAsync(dto.Id);
            if (customer == null) return NotFound();

            mapper.Map(dto, customer);
            customer.UpdatedAt = DateTime.UtcNow;

            await repository.UpdateAsync(customer);
            await repository.SaveChangesAsync();

            return Ok(new { Message = "Customer updated successfully" });
        }

        [HttpPost("delete")]
        public async Task<ActionResult> Delete([FromBody] IdRequest request)
        {
            await repository.DeleteAsync(request.Id);
            await repository.SaveChangesAsync();
            return NoContent();
        }
    }
}
