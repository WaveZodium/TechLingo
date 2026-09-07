using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;
using TechLingo.Core.Enums;

namespace TechLingo.Core.Entities
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        [BsonRepresentation(BsonType.String)]
        public UserRole Role { get; set; } = UserRole.User; // "Admin" sätts manuellt för administratörer

        public int TotalScore { get; set; } = 0;
    }
}
