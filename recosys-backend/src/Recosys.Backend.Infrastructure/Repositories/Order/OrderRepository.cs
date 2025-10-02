using Microsoft.EntityFrameworkCore;
using Recosys.Backend.Application.DTOs.Shiprocket;
using Recosys.Backend.Application.Interfaces.Order;
using Recosys.Backend.Domain.Entities.Customer;
using Recosys.Backend.Domain.Entities.Order;
using Recosys.Backend.Infrastructure.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Recosys.Backend.Infrastructure.Repositories.Order
{
    public class OrderRepository(AppDbContext context) : IOrderRepository
    {
        private readonly AppDbContext _context = context;

        public async Task<int> BulkInsertOrdersAsync(List<ShiprocketOrderDto> orderDtos)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var existingIds = await _context.Order
                    .Select(o => o.ShiprocketId)
                    .ToHashSetAsync();

                var newOrdersDtos = orderDtos
                    .Where(dto => !existingIds.Contains(dto.ShiprocketId))
                    .ToList();

                if (!newOrdersDtos.Any())
                    return 0;

                var orders = new List<OrderDetails>();

                foreach (var dto in newOrdersDtos)
                {
                    var customerId = await _context.CustomerDetails
                        .Where(c => c.Phone == dto.CustomerPhone)
                        .Select(c => c.Id)
                        .FirstOrDefaultAsync();

                    if (customerId == 0)
                    {
                        var newCustomer = new CustomerDetails
                        {
                            FullName = dto.CustomerName?.Trim(),
                            Email = dto.CustomerEmail,
                            Phone = dto.CustomerPhone,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow,
                            Addresses =
                            [
                                new CustomerAddress
                                {
                                    Address = $"{dto.CustomerAddress}, {dto.CustomerAddress2}".Trim(' ', ','),
                                    Pincode = dto.CustomerPincode,
                                    City = dto.CustomerCity,
                                    State = dto.CustomerState,
                                    Country = dto.CustomerCountry == "IN" ? "India" : dto.CustomerCountry,
                                    IsDefault = true,
                                    CreatedAt = DateTime.UtcNow,
                                    UpdatedAt = DateTime.UtcNow
                                }
                            ]
                        };

                        _context.CustomerDetails.Add(newCustomer);
                        await _context.SaveChangesAsync();
                        customerId = newCustomer.Id;
                    }

                    var order = new OrderDetails
                    {
                        ShiprocketId = dto.ShiprocketId,
                        ChannelId = dto.ChannelId,
                        ChannelName = dto.ChannelName,
                        BaseChannelCode = dto.BaseChannelCode,
                        ChannelOrderId = dto.ChannelOrderId,
                        CustomerId = customerId,
                        PickupLocation = dto.PickupLocation,
                        Total = dto.Total,
                        StatusCode = dto.StatusCode,
                        PaymentMethod = dto.PaymentMethod,
                        BrandName = dto.BrandName,
                        MarketplaceId = dto.MarketplaceId,
                        AllowReturn = dto.AllowReturn,
                        PickupExceptionReason = dto.PickupExceptionReason,
                        ETDDate = dto.EtdDate,
                        OutForDeliveryDate = dto.OutForDeliveryDate,
                        DeliveredDate = dto.DeliveredDate,
                        InvoiceNo = dto.InvoiceNo,
                        ChannelCreatedAt = dto.ChannelCreatedAt,
                        CreatedAt = dto.CreatedAt,
                        UpdatedAt = dto.UpdatedAt,

                        Products = dto.Products?.Select(p => new OrderProduct
                        {   
                            ProductLineId = p.Id,
                            ChannelOrderProductId = p.ChannelOrderProductId,
                            Name = p.Name,
                            ChannelSKU = p.ChannelSku,
                            Quantity = p.Quantity,
                            ProductId = p.ProductId,
                            Available = p.Available,
                            Price = p.Price,
                            ProductCost = p.ProductCost,
                            HSN = p.Hsn,
                            Discount = p.Discount,
                            DiscountIncludingTax = p.DiscountIncludingTax,
                            SellingPrice = p.SellingPrice,
                            MRP = p.Mrp,
                            TaxPercentage = p.TaxPercentage,
                            Description = p.Description
                        }).ToList(),

                        Shipments = dto.Shipments?.Select(s => new Shipment
                        {
                            ShipmentId = s.Id,
                            ISDCode = s.IsdCode,
                            Courier = s.Courier,
                            CourierId = s.CourierId,
                            Weight = s.Weight,
                            Dimensions = s.Dimensions,
                            AWB = s.Awb,
                            DeliveredDate = s.DeliveredDate,
                            Status = s.Status,
                            Total = s.Total,
                            Cost = s.Cost
                        }).ToList(),

                        Activities = dto.Activities?.Select(a => new OrderActivity
                        {
                            Activity = a
                        }).ToList(),

                        AWBData = dto.AwbData?.Charges != null ? new AWBData
                        {
                            Zone = dto.AwbData.Charges.Zone,
                            CODCharges = dto.AwbData.Charges.CODCharges,
                            AppliedWeightAmount = dto.AwbData.Charges.AppliedWeightAmount,
                            FreightCharges = dto.AwbData.Charges.FreightCharges,
                            AppliedWeight = dto.AwbData.Charges.AppliedWeight,
                            ChargedWeight = dto.AwbData.Charges.ChargedWeight,
                            ChargedWeightAmount = dto.AwbData.Charges.ChargedWeightAmount,
                            ChargedWeightAmountRTO = dto.AwbData.Charges.ChargedWeightAmountRTO,
                            AppliedWeightAmountRTO = dto.AwbData.Charges.AppliedWeightAmountRTO,
                            BillingAmount = dto.AwbData.Charges.BillingAmount,
                            ServiceTypeId = dto.AwbData.Charges.ServiceTypeId
                        } : null
                    };

                    orders.Add(order);
                }

                await _context.Order.AddRangeAsync(orders);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
                return orders.Count;
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
    }
}
