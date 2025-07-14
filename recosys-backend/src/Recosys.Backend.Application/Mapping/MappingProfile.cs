using AutoMapper;
using Recosys.Backend.Domain.Entities;
using Recosys.Backend.Application.DTOs;

namespace Recosys.Backend.Application.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<ProductDetails, ProductDetailsDto>().ReverseMap();
        }
    }
}
