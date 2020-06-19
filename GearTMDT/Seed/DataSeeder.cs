using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GearTMDT.Context;
using GearTMDT.Model;

namespace GearTMDT.Seed
{
    public class DataSeeder
    {
        public static async Task SeedCatalog(GearContext context)
        {
            context.Database.EnsureCreated();

            

            if(!context.Catalogs.Any())
            {
                var catalogs = new List<Catalog>
                {
                    new Catalog { Name = "Chuột", Description = "Các sản phẩm liên quan đến chuột: chuột chơi game, chuột văn phòng"},
                    new Catalog { Name = "Bàn Phím", Description = "Các sản phẩm bàn phím như bàn phím cơ, bàn phím văn phòng,..."},
                    new Catalog { Name = "Tai nghe", Description = "Nhiều thể loại tai nghe từ tai nghe gaming đến tai nghe chuyên về nghe nhạc"},
                };
                await context.Catalogs.AddRangeAsync(catalogs);
                await context.SaveChangesAsync();
            }

            if(!context.Producers.Any())
            {
                var producers = new List<Producer>
                {
                    new Producer { Name = "MSI", Description = "Một hãng nổi tiếng chuyên về các thể loại chuột, laptop gaming,..."},
                    new Producer { Name = "Logitech", Description = "Được biết là một hãng với các thiết bị gaming đạt chất lượng toàn cầu"},
                    new Producer { Name = "Sony", Description = "Hãng với nhiều thiết bị công nghệ đình đám của Nhật Bản"},
                };
                await context.Producers.AddRangeAsync(producers);
                await context.SaveChangesAsync();
            }

            if(!context.Products.Any())
            {
                var products = new List<Product>
                {
                    new Product { Name = "Product 1", Image = "aqua.jpg", SubImage = "aqua.jpg", Description = "<div>Hello</div>", Price = 4300000, Discount = 30, PriceDiscount = 299999, CatalogID = 1,ProducerID = 1, Stock = 20, Slug = "product-1"},
                    new Product { Name = "Product 2222222", Image = "aqua.jpg", SubImage = "aqua.jpg", Description = "abc", Price = 4800000, Discount = 30, PriceDiscount = 299999, CatalogID = 1,ProducerID = 1, Stock = 20, Slug = "product-2"},
                    // new Product { Name = "Product 1", Image = "aqua.jpg", SubImage = "aqua.jpg", Description = "abc", Price = 4300000, Discount = 30, PriceDiscount = 1, CatalogID = 1,ProducerID = 1, Stock = 20, Slug = "product-1"},
                    // new Product { Name = "Product 1", Image = "aqua.jpg", SubImage = "aqua.jpg", Description = "abc", Price = 4300000, Discount = 30, PriceDiscount = 5, CatalogID = 1,ProducerID = 1, Stock = 20, Slug = "product-1"},
                    // new Product { Name = "Product 1", Image = "aqua.jpg", SubImage = "aqua.jpg", Description = "abc", Price = 4300000, Discount = 30, PriceDiscount = 299999, CatalogID = 1,ProducerID = 1, Stock = 20, Slug = "product-1"},
                    // new Product { Name = "Product 1", Image = "aqua.jpg", SubImage = "aqua.jpg", Description = "abc", Price = 4300000, Discount = 30, PriceDiscount = 1, CatalogID = 2,ProducerID = 1, Stock = 20, Slug = "product-1"},
                    // new Product { Name = "Product 1", Image = "aqua.jpg", SubImage = "aqua.jpg", Description = "abc", Price = 4300000, Discount = 30, PriceDiscount = 9, CatalogID = 1,ProducerID = 1, Stock = 20, Slug = "product-1"},
                    // new Product { Name = "Product 1", Image = "aqua.jpg", SubImage = "aqua.jpg", Description = "abc", Price = 4300000, Discount = 30, PriceDiscount = 299999, CatalogID = 2,ProducerID = 1, Stock = 20, Slug = "product-1"},
                    // new Product { Name = "Product 1", Image = "aqua.jpg", SubImage = "aqua.jpg", Description = "abc", Price = 4300000, Discount = 30, PriceDiscount = 299999, CatalogID = 1,ProducerID = 1, Stock = 20, Slug = "product-1"},
                    // new Product { Name = "Product 1", Image = "aqua.jpg", SubImage = "aqua.jpg", Description = "abc", Price = 4300000, Discount = 30, PriceDiscount = 3, CatalogID = 1,ProducerID = 1, Stock = 20, Slug = "product-1"},
                    // new Product { Name = "Product 1", Image = "aqua.jpg", SubImage = "aqua.jpg", Description = "abc", Price = 4300000, Discount = 30, PriceDiscount = 299999, CatalogID = 1,ProducerID = 1, Stock = 20, Slug = "product-1"},
                    // new Product { Name = "Product 1", Image = "aqua.jpg", SubImage = "aqua.jpg", Description = "abc", Price = 4300000, Discount = 30, PriceDiscount = 299999, CatalogID = 1,ProducerID = 1, Stock = 20, Slug = "product-1"},
                    // new Product { Name = "Product 1", Image = "aqua.jpg", SubImage = "aqua.jpg", Description = "abc", Price = 4300000, Discount = 30, PriceDiscount = 299999, CatalogID = 1,ProducerID = 1, Stock = 20, Slug = "product-1"},
                    // new Product { Name = "Product 1", Image = "aqua.jpg", SubImage = "aqua.jpg", Description = "abc", Price = 4300000, Discount = 30, PriceDiscount = 299999, CatalogID = 1,ProducerID = 1, Stock = 20, Slug = "product-1"},
                    // new Product { Name = "Product 1", Image = "aqua.jpg", SubImage = "aqua.jpg", Description = "abc", Price = 4300000, Discount = 30, PriceDiscount = 299999, CatalogID = 1,ProducerID = 1, Stock = 20, Slug = "product-1"},
                    // new Product { Name = "Product 1", Image = "aqua.jpg", SubImage = "aqua.jpg", Description = "abc", Price = 4300000, Discount = 30, PriceDiscount = 299999, CatalogID = 1,ProducerID = 1, Stock = 20, Slug = "product-1"},
                    // new Product { Name = "Product 1", Image = "aqua.jpg", SubImage = "aqua.jpg", Description = "abc", Price = 4300000, Discount = 30, PriceDiscount = 299999, CatalogID = 2,ProducerID = 1, Stock = 20, Slug = "product-1"},
                    // new Product { Name = "Product 1", Image = "aqua.jpg", SubImage = "aqua.jpg", Description = "abc", Price = 4300000, Discount = 30, PriceDiscount = 299999, CatalogID = 1,ProducerID = 1, Stock = 20, Slug = "product-1"},
                    // new Product { Name = "Product 1", Image = "aqua.jpg", SubImage = "aqua.jpg", Description = "abc", Price = 4300000, Discount = 30, PriceDiscount = 299999, CatalogID = 1,ProducerID = 1, Stock = 20, Slug = "product-1"},
                    // new Product { Name = "Product 1", Image = "aqua.jpg", SubImage = "aqua.jpg", Description = "abc", Price = 4300000, Discount = 30, PriceDiscount = 299999, CatalogID = 1,ProducerID = 1, Stock = 20, Slug = "product-1"},
                    // new Product { Name = "Product 1", Image = "aqua.jpg", SubImage = "aqua.jpg", Description = "abc", Price = 4300000, Discount = 30, PriceDiscount = 299999, CatalogID = 1,ProducerID = 1, Stock = 20, Slug = "product-1"},
                    // new Product { Name = "Product 1", Image = "aqua.jpg", SubImage = "aqua.jpg", Description = "abc", Price = 4300000, Discount = 30, PriceDiscount = 299999, CatalogID = 1,ProducerID = 1, Stock = 20, Slug = "product-1"},
                    // new Product { Name = "Product 1", Image = "aqua.jpg", SubImage = "aqua.jpg", Description = "abc", Price = 4300000, Discount = 30, PriceDiscount = 299999, CatalogID = 2,ProducerID = 1, Stock = 20, Slug = "product-1"},
                    // new Product { Name = "Product 1", Image = "aqua.jpg", SubImage = "aqua.jpg", Description = "abc", Price = 4300000, Discount = 30, PriceDiscount = 299999, CatalogID = 1,ProducerID = 1, Stock = 20, Slug = "product-1"},
                    // new Product { Name = "Product 1", Image = "aqua.jpg", SubImage = "aqua.jpg", Description = "abc", Price = 4300000, Discount = 30, PriceDiscount = 299999, CatalogID = 1,ProducerID = 1, Stock = 20, Slug = "product-1"},
                    // new Product { Name = "Product 1", Image = "aqua.jpg", SubImage = "aqua.jpg", Description = "abc", Price = 4300000, Discount = 30, PriceDiscount = 299999, CatalogID = 2,ProducerID = 1, Stock = 20, Slug = "product-1"},
                    // new Product { Name = "Product 1", Image = "aqua.jpg", SubImage = "aqua.jpg", Description = "abc", Price = 4300000, Discount = 30, PriceDiscount = 299999, CatalogID = 1,ProducerID = 1, Stock = 20, Slug = "product-1"},
                    // new Product { Name = "Product 1", Image = "aqua.jpg", SubImage = "aqua.jpg", Description = "abc", Price = 4300000, Discount = 30, PriceDiscount = 299999, CatalogID = 1,ProducerID = 1, Stock = 20, Slug = "product-1"},
                };
                await context.Products.AddRangeAsync(products);
                await context.SaveChangesAsync();
            }

            if(!context.CartItems.Any())
            {
                var cartItems = new List<CartItem>
                {
                    new CartItem {UserId = "100" , Product = context.Products.FirstOrDefault(), Quantity=1}
                };
                await context.CartItems.AddRangeAsync(cartItems);
                await context.SaveChangesAsync();
            }

            if(!context.Orders.Any())
            {
                var orders = new List<Order>
                {
                    new Order {OrderId = "100", ShippingAddress= "aaa" , ShippingPhone="aaaa" , ShippingReciver="aaa" , UserId = "f2de0d50-9fd5-45b3-aa4f-923b843f8b5d", CreateDT = DateTime.UtcNow.AddHours(7),TotalPrice = context.Products.FirstOrDefault().PriceDiscount ,OrderStatus="Đang giao"},
                    new Order {OrderId = "101", ShippingAddress= "aaa" , ShippingPhone="aaaa" , ShippingReciver="aaa" , UserId = "f2de0d50-9fd5-45b3-aa4f-923b843f8b5d", CreateDT = DateTime.UtcNow.AddHours(15),TotalPrice = context.Products.FirstOrDefault().PriceDiscount ,OrderStatus="Đang giao"},
                    new Order {OrderId = "102", ShippingAddress= "aaa" , ShippingPhone="aaaa" , ShippingReciver="aaa" , UserId = "f2de0d50-9fd5-45b3-aa4f-923b843f8b5d", CreateDT = DateTime.UtcNow.AddHours(10),TotalPrice = context.Products.FirstOrDefault().PriceDiscount ,OrderStatus="Đang giao"},
                    new Order {OrderId = "103", ShippingAddress= "aaa" , ShippingPhone="aaaa" , ShippingReciver="aaa" , UserId = "f2de0d50-9fd5-45b3-aa4f-923b843f8b5d", CreateDT = DateTime.UtcNow.AddHours(18),TotalPrice = context.Products.FirstOrDefault().PriceDiscount ,OrderStatus="Đang giao"},
                    new Order {OrderId = "104", ShippingAddress= "aaa" , ShippingPhone="aaaa" , ShippingReciver="aaa" , UserId = "f2de0d50-9fd5-45b3-aa4f-923b843f8b5d", CreateDT = DateTime.UtcNow.AddHours(15),TotalPrice = context.Products.FirstOrDefault().PriceDiscount ,OrderStatus="Đang giao"},
                    new Order {OrderId = "105", ShippingAddress= "aaa" , ShippingPhone="aaaa" , ShippingReciver="aaa" , UserId = "f2de0d50-9fd5-45b3-aa4f-923b843f8b5d", CreateDT = DateTime.UtcNow.AddHours(15),TotalPrice = context.Products.FirstOrDefault().PriceDiscount ,OrderStatus="Đang giao"},
                };
                await context.Orders.AddRangeAsync(orders);
                await context.SaveChangesAsync();
            }

            if(!context.OrderItems.Any())
            {
                var orderItems = new List <OrderItem>
                {
                    new OrderItem {OrderId=1,ProductId=1,Quantity=10},
                    new OrderItem {OrderId=2,ProductId=1,Quantity=1},
                    new OrderItem {OrderId=1,ProductId=2,Quantity=5},
                };
                await context.OrderItems.AddRangeAsync(orderItems);
                await context.SaveChangesAsync();
            }
        }
    }
}