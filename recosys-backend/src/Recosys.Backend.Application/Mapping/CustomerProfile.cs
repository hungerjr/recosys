using AutoMapper;
using Recosys.Backend.Application.DTOs.Customer;
using Recosys.Backend.Domain.Entities.Customer;
using System.Collections.Generic;
using System.Linq;

namespace Recosys.Backend.Application.Mapping
{
    public class CustomerProfile : Profile
    {
        public CustomerProfile()
        {
            // ✅ CreateCustomerDetailsDto → CustomerDetails
            CreateMap<CreateCustomerDetailsDto, CustomerDetails>()
                .ForMember(dest => dest.Addresses,
                           opt => opt.MapFrom(src =>
                               src.Address != null
                                   ? new List<CustomerAddress>
                                     {
                                         new CustomerAddress
                                         {
                                             Address = src.Address.Address,
                                             City = src.Address.City,
                                             State = src.Address.State,
                                             Country = src.Address.Country,
                                             Pincode = src.Address.Pincode,
                                             IsDefault = true // Set default here
                                         }
                                     }
                                   : new List<CustomerAddress>()
                           ));

            // ✅ UpdateCustomerDetailsDto → CustomerDetails
            CreateMap<UpdateCustomerDetailsDto, CustomerDetails>()
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore()) // Prevent overwriting
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.Addresses, opt => opt.Ignore()); // Let repo manage address updates

            // ✅ CustomerDetails → CustomerDetailsDto
            CreateMap<CustomerDetails, CustomerDetailsDto>()
                .ForMember(dest => dest.DefaultAddress,
                           opt => opt.MapFrom(src => src.Addresses.FirstOrDefault(a => a.IsDefault)));
        }
    }
}
