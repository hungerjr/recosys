using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Recosys.Backend.Application.DTOs;
using Recosys.Backend.Application.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Recosys.Backend.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Require valid JWT token
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository _productRepository;

        private readonly IMapper _mapper;

        public ProductsController(IProductRepository productRepository, IMapper mapper)
        {
            _productRepository = productRepository;
            _mapper = mapper;
        }

        // GET: api/products
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _productRepository.GetAllAsync();
            var productDtos = _mapper.Map<IEnumerable<ProductDetailsDto>>(products);
            return Ok(productDtos);
        }

        // GET: api/products/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null) return NotFound();

            return Ok(_mapper.Map<ProductDetailsDto>(product));
        }
    }
}
