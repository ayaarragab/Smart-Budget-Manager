using Domin.Models;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations.Schema;
using System.Transactions;

namespace Domain.Models;

public enum WalletType
{
    Cash,
    Bank,
    Card
}

public class Wallet
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public WalletType Type { get; set; }
    public decimal Balance { get; set; }
    public DateTime Date { get; set; }
    public string  UserId { get; set; }

    [ValidateNever]
    public User User { get; set; }

    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}
