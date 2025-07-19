using AutoMapper;
using Recosys.Backend.Application.DTOs.Customer;
using Recosys.Backend.Domain.Entities.Customer;

namespace Recosys.Backend.Application.Mapping
{
    public class CustomerProfile : Profile
    {
        public CustomerProfile()
        {
            CreateMap<CreateCustomerDetailsDto, CustomerDetails>();
            CreateMap<CustomerDetails, CustomerDetailsDto>();
            CreateMap<CustomerDetailsDto, CustomerDetails>()
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore()); // Prevent overwriting original CreatedAt

            CreateMap<UpdateCustomerDetailsDto, CustomerDetails>()
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore()) // Prevent overwriting
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());
        }
    }
}
