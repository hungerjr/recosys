using AutoMapper;
using Recosys.Backend.Application.DTOs.Customer;
using Recosys.Backend.Domain.Entities.Customer;

namespace Recosys.Backend.Application.Mapping
{
    public class AddressProfile : Profile
    {
        public AddressProfile()
        {
            // Entity ↔ DTO
            CreateMap<CustomerAddress, CustomerAddressDto>().ReverseMap();

            // Create DTO → Entity
            CreateMap<CreateCustomerAddressDto, CustomerAddress>()
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());


            // Update DTO → Entity
            CreateMap<UpdateCustomerAddressDto, CustomerAddress>()
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());
        }
    }

}
