﻿using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;

namespace GearTMDT.Model
{
    // Add profile data for application users by adding properties to the ApplicationUser class
    public class ApplicationUser : IdentityUser
    {

        public string Name { get; set; }
        public string Address { get; set; }

        public string Role { get; set; }

        public string Status { get; set; }

    }
}
