using AutoMapper;
using Recosys.Backend.Application.DTOs.Customer;
using Recosys.Backend.Application.DTOs.Products;
using Recosys.Backend.Domain.Entities.Customer;
using Recosys.Backend.Domain.Entities.Products;

namespace Recosys.Backend.Application.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Products Mapping
            CreateMap<ProductDetails, ProductDetailsDto>().ReverseMap();
        }
    }
}
