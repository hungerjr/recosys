using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Recosys.Backend.Application.DTOs.Products;
using Recosys.Backend.Application.Interfaces.Products;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Recosys.Backend.Api.Controllers.Product
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Require valid JWT token
    public class ProductsController(IProductRepository productRepository, IMapper mapper) : ControllerBase
    {
        // GET: api/products
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await productRepository.GetAllAsync();
            var productDtos = mapper.Map<IEnumerable<ProductDetailsDto>>(products);
            return Ok(productDtos);
        }

        // GET: api/products/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await productRepository.GetByIdAsync(id);
            if (product == null) return NotFound();

            return Ok(mapper.Map<ProductDetailsDto>(product));
        }
    }
}
