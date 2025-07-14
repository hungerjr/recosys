using System.Collections.Generic;

namespace Recosys.Backend.Domain.Entities
{
    public class UserRole
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public ICollection<UserInfo> Users { get; set; }
    }
}
