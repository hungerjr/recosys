using System;
using System.Collections.Generic;

namespace Recosys.Backend.Domain.Entities
{
    public class UserInfo
    {
        public int Id { get; set; }
        public string PasswordHash { get; set; }
        public string Name { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string PasswordResetToken { get; set; }
        public DateTime? ResetTokenExpiry { get; set; }
        public bool IsActive { get; set; }

        // FK to role
        public int UserRoleId { get; set; }
        public UserRole UserRole { get; set; }

        public ICollection<PasswordResetToken> PasswordResetTokens { get; set; }
    }
}
