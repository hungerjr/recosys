using AutoMapper;
using ReCoSys.ECommerce.Domain.Entities;
using ReCoSys.ECommerce.Application.DTOs;

namespace ReCoSys.ECommerce.Application.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<ProductDetails, ProductDetailsDto>().ReverseMap();
        }
    }
}
