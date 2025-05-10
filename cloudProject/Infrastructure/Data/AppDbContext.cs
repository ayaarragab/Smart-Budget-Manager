using Domain.Models;
using Domin.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class AppDbContext : IdentityDbContext<User>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
       public DbSet<Category> Categories { get; set; }
       public DbSet<Budget> Budgets { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<Wallet> Wallets { get; set; }
        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    modelBuilder.Entity<Transaction>()
        //        .HasOne(t => t.Wallet)
        //        .WithMany(w => w.Transactions)
        //        .HasForeignKey(t => t.WalletId)
        //        .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete

        //    modelBuilder.Entity<Transaction>()
        //        .HasOne(t => t.Category)
        //        .WithMany(c => c.Transactions)
        //        .HasForeignKey(t => t.CategoryId)
        //        .OnDelete(DeleteBehavior.Restrict); // Also prevent cascade delete if needed
        //}
        //protected override void OnModelCreating(ModelBuilder builder)
        //{
        //    base.OnModelCreating(builder);

        //    // Simple configuration without Category-Budget relationship
        //    builder.Entity<Budget>()
        //        .HasOne(b => b.User)
        //        .WithMany()
        //        .HasForeignKey(b => b.UserId)
        //        .OnDelete(DeleteBehavior.Cascade);

        //    builder.Entity<Category>()
        //        .HasOne(c => c.User)
        //        .WithMany()
        //        .HasForeignKey(c => c.UserId)
        //        .OnDelete(DeleteBehavior.Cascade);
        //}
    }
}
