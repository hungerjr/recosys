using Microsoft.EntityFrameworkCore;
using Recosys.Backend.Application.Common.Models;
using Recosys.Backend.Application.DTOs.Order;
using Recosys.Backend.Application.DTOs.Shiprocket;
using Recosys.Backend.Application.Interfaces.Order;
using Recosys.Backend.Domain.Entities.Customer;
using Recosys.Backend.Domain.Entities.Order;
using Recosys.Backend.Infrastructure.Persistence;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;

namespace Recosys.Backend.Infrastructure.Repositories.Order
{
    public class OrderRepository(AppDbContext context) : IOrderRepository
    {
        private readonly AppDbContext _context = context;

        public Task<int> CreateOrderAsync(OrderDetailsDto dto)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteOrderAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<PagedResult<OrderDetailsDto>> GetPagedOrdersAsync(
                             int pageNumber, int pageSize,
                             string? sortBy, string? sortOrder,
                             string? channelOrderId, string? AWB, string? statusDescription)
        {
            using var connection = _context.Database.GetDbConnection();
            await connection.OpenAsync();

            var skip = (pageNumber - 1) * pageSize;
            var take = pageSize;

            var sql = @"SELECT o.Id, o.ChannelOrderId, o.Total, o.PaymentMethod, o.StatusCode, o.CreatedAt,
                            c.FullName AS CustomerName,  c.Phone AS CustomerPhone,
                            p.ProductLineId, p.Name AS ProductName, p.ChannelSKU, p.Quantity,
                            s.ShipmentId, s.Courier, s.AWB, s.Weight, s.Dimensions,
                            st.StatusDescription

                            FROM [Order] o
                            LEFT JOIN CustomerDetails c ON o.CustomerId = c.Id
                            LEFT JOIN OrderProduct p ON o.Id = p.OrderId
                            LEFT JOIN Shipment s ON o.Id = s.OrderId
                            LEFT JOIN Status st ON o.StatusCode = st.StatusCode

                            WHERE
                                (@channelOrderId IS NULL OR o.ChannelOrderId LIKE '%' + @channelOrderId + '%') AND
                                (@AWB IS NULL OR s.AWB LIKE '%' + @AWB + '%') AND
                                (@statusDescription IS NULL OR st.StatusDescription LIKE '%' + @statusDescription + '%')";

            string orderByClause = sortBy?.ToLower() switch
            {
                "createdat" => $"ORDER BY o.CreatedAt {(sortOrder?.ToLower() == "asc" ? "ASC" : "DESC")}",
                "status" => $"ORDER BY st.StatusDescription {(sortOrder?.ToLower() == "asc" ? "ASC" : "DESC")}",
                _ => $"ORDER BY o.Id {(sortOrder?.ToLower() == "asc" ? "ASC" : "DESC")}"
            };

            sql += $@" {orderByClause}
                    OFFSET @skip ROWS FETCH NEXT @take ROWS ONLY;

                    SELECT COUNT(*)
                    FROM [Order] o
                    LEFT JOIN Shipment s ON o.Id = s.OrderId
                    LEFT JOIN Status st ON o.StatusCode = st.StatusCode
                    WHERE
                        (@channelOrderId IS NULL OR o.ChannelOrderId LIKE '%' + @channelOrderId + '%') AND
                        (@AWB IS NULL OR s.AWB LIKE '%' + @AWB + '%') AND
                        (@statusDescription IS NULL OR st.StatusDescription LIKE '%' + @statusDescription + '%');
                    ";


            using var command = connection.CreateCommand();
            command.CommandText = sql;

            var parameters = new[]
            {
                CreateParam(command, "@channelOrderId", channelOrderId),
                CreateParam(command, "@AWB", AWB),
                CreateParam(command, "@statusDescription", statusDescription),
                CreateParam(command, "@sortBy", sortBy ?? "id"),
                CreateParam(command, "@sortOrder", sortOrder ?? "desc"),
                CreateParam(command, "@skip", skip),
                CreateParam(command, "@take", take)
            };
            foreach (var p in parameters) command.Parameters.Add(p);

            var orders = new List<OrderDetailsDto>();
            int totalCount = 0;

            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                var orderId = reader.GetInt32(0);
                var existingOrder = orders.FirstOrDefault(o => o.Id == orderId);

                if (existingOrder == null)
                {
                    existingOrder = new OrderDetailsDto
                    {
                        Id = orderId,
                        ChannelOrderId = reader.IsDBNull(1) ? null : reader.GetString(1),
                        Total = reader.GetDecimal(2),
                        PaymentMethod = reader.IsDBNull(3) ? null : reader.GetString(3),
                        StatusCode = reader.GetInt32(4),
                        StatusMessage = reader.IsDBNull(17) ? null : reader.GetString(17),
                        CreatedAt = reader.GetDateTime(5),
                        CustomerName = reader.IsDBNull(6) ? null : reader.GetString(6),
                        CustomerPhone = reader.IsDBNull(7) ? null : reader.GetString(7),
                        Products = new List<OrderProductDto>(),
                        Shipments = new List<ShipmentDto>()
                    };
                    orders.Add(existingOrder);
                }

                if (!reader.IsDBNull(8))
                {
                    var productLineId = reader.GetInt64(8);
                    if (!existingOrder.Products.Any(p => p.ProductLineId == productLineId))
                    {
                        existingOrder.Products.Add(new OrderProductDto
                        {
                            ProductLineId = productLineId,
                            Name = reader.IsDBNull(9) ? null : reader.GetString(9),
                            ChannelSku = reader.IsDBNull(10) ? null : reader.GetString(10),
                            Quantity = reader.GetInt32(11)
                        });
                    }
                }

                if (!reader.IsDBNull(12))
                {
                    var shipmentId = reader.GetInt64(12);
                    if (!existingOrder.Shipments.Any(s => s.ShipmentId == shipmentId))
                    {
                        existingOrder.Shipments.Add(new ShipmentDto
                        {
                            ShipmentId = shipmentId,
                            Courier = reader.IsDBNull(13) ? null : reader.GetString(13),
                            Awb = reader.IsDBNull(14) ? null : reader.GetString(14),
                            Weight = reader.IsDBNull(15) ? 0 : reader.GetDecimal(15),
                            Dimensions = reader.IsDBNull(16) ? null : reader.GetString(16)
                        });
                    }
                }
            }

            if (await reader.NextResultAsync() && await reader.ReadAsync())
                totalCount = reader.GetInt32(0);

            return new PagedResult<OrderDetailsDto>(orders, totalCount, pageNumber, pageSize);
        }

        public Task<OrderDetailsDto> GetOrderByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> UpdateOrderAsync(int id, OrderDetailsDto dto)
        {
            throw new NotImplementedException();
        }

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

                    var statusCode = await _context.Status
                        .Where(s => s.StatusCode == dto.StatusCode)
                        .Select(s => s.StatusCode)
                        .FirstOrDefaultAsync();

                    if (statusCode == 0)
                    {
                        var newStatus = new Status
                        {
                            StatusCode = dto.StatusCode,
                            StatusDescription = dto.Status,
                        };
                        _context.Status.Add(newStatus);
                        await _context.SaveChangesAsync();
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

        public async Task<(bool exists, AwbCheckDto? order)> CheckAwbDetailsAsync(string awb)
        {
            if (string.IsNullOrWhiteSpace(awb))
                return (false, null);

            using var connection = _context.Database.GetDbConnection();
            await connection.OpenAsync();

            var sql = @"
                        SELECT TOP 1 
                            p.Name AS ProductName,
                            s.AWB,
                            s.Courier,
                            p.Quantity,
                            o.CreatedAt
                        FROM Shipment s
                        INNER JOIN [Order] o ON s.OrderId = o.Id
                        INNER JOIN OrderProduct p ON o.Id = p.OrderId
                        WHERE s.AWB = @awb;
                    ";

            using var command = connection.CreateCommand();
            command.CommandText = sql;
            command.Parameters.Add(CreateParam(command, "@awb", awb));

            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                var dto = new AwbCheckDto
                {
                    ProductName = reader.IsDBNull(0) ? null : reader.GetString(0),
                    AWB = reader.IsDBNull(1) ? null : reader.GetString(1),
                    Courier = reader.IsDBNull(2) ? null : reader.GetString(2),
                    Quantity = reader.IsDBNull(3) ? 0 : reader.GetInt32(3),
                    CreatedAt = reader.GetDateTime(4)
                };

                return (true, dto);
            }

            return (false, null);
        }

        private static DbParameter CreateParam(DbCommand command, string name, object? value)
        {
            var param = command.CreateParameter();
            param.ParameterName = name;
            param.Value = value ?? DBNull.Value;
            return param;
        }
    }
}
