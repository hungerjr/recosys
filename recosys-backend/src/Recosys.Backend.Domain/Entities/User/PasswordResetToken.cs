using System;

namespace Recosys.Backend.Domain.Entities.User
{
    public class PasswordResetToken
    {
        public int Id { get; set; }
        public string Token { get; set; }
        public DateTime ExpiryDate { get; set; }
        public bool IsUsed { get; set; }

        // Foreign key
        public int UserInfoId { get; set; }
        public UserInfo User { get; set; }
    }

}
