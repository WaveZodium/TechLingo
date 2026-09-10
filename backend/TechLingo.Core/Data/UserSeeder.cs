using MongoDB.Driver;
using TechLingo.Core.Entities;
using TechLingo.Core.Enums;

namespace TechLingo.Core.Data
{
    public class UserSeeder
    {
        public async Task SeedAsync(IMongoCollection<User> users)
        {
            var adminUser = await users
                .Find(u => u.Username == "admin")
                .FirstOrDefaultAsync();

            if (adminUser is null)
            {
                adminUser = new User
                {
                    Username = "admin",

                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin"),

                    Role = UserRole.Admin
                };

                await users.InsertOneAsync(adminUser);
            }
        }
    }
}
