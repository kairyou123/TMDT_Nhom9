using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using GearTMDT.Model;
using Microsoft.EntityFrameworkCore;

namespace GearTMDT.Context
{
    public class GearContext : DbContext
    {
        public GearContext(DbContextOptions<GearContext> options)
                : base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Order>().HasIndex(o => o.OrderId).IsUnique();
            builder.Entity<Order>().Property(o=>o.OrderId).HasDefaultValueSql("NEWID()");
            builder.Entity<OrderItem>()
            .HasOne(i => i.Order)
            .WithMany(o =>o.OrderItems)
            .HasForeignKey(i => i.OrderId);    
        }
        
        public DbSet<Product> Products { get; set; }
        public DbSet<Catalog> Catalogs { get; set; }
        public DbSet<Producer> Producers { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
    }
}