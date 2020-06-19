using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using GearTMDT.Context;
using GearTMDT.Model;
using GearTMDT.Repository;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace GearTMDT
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            services.AddScoped<ICatalogRepository,CatalogRepository>();
            services.AddScoped<IProductRepository,ProductRepository>();
            services.AddScoped<IProducerRepository,ProducerRepository>();
            services.AddScoped<ICartItemRepository,CartItemRepository>();
            services.AddScoped<IOrderItemRepository, OrderItemRepository>();
            services.AddScoped<IOrderRepository, OrderRepository>();

            // services.AddDbContext<GearContext>(options =>
            //     options.UseSqlServer(Configuration.GetConnectionString("GearContext")));
            services.AddAuthentication("Bearer")
            .AddIdentityServerAuthentication(options =>
            {
                options.Authority = "http://localhost:5000";
                options.RequireHttpsMetadata = false;

                options.ApiName = "gearapi";
                options.ApiSecret ="serect";
            });
            
           
            services.AddDbContext<GearContext>(options =>
                 options.UseSqlite(Configuration.GetConnectionString("GearContext")));
            services.AddDbContext<ApplicationDbContext>(options =>
                 options.UseSqlite(Configuration.GetConnectionString("UserIdentity")));

            services.AddIdentityCore<ApplicationUser>(options => { });
            new IdentityBuilder(typeof(ApplicationUser), services)
                .AddSignInManager<SignInManager<ApplicationUser>>()
                .AddEntityFrameworkStores<ApplicationDbContext>();

             services.AddCors(options =>
            {
                // this defines a CORS policy called "default"
                options.AddPolicy("default", builder =>
                {
                    builder.WithOrigins("http://localhost:5003", "http://localhost:5000")
                            .AllowAnyMethod()
                            .AllowAnyHeader();
                });
            });

            
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();
            app.UseCors("default");
            app.UseRouting();
            
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseStaticFiles();

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(
                    Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Image")),
                RequestPath = "/Image"
            });
            

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
