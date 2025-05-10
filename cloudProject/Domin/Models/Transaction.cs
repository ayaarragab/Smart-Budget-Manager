using Domin.Models;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Models;

public enum TransactionType
{
    Income,
    Expense
}
public class Transaction
{
    public int Id { get; set; }
    public decimal Amount { get; set; }

    public TransactionType Type { get; set; }
    public int CategoryId { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; }
    public int WalletId { get; set; }
    [ForeignKey("WalletId")]
    public Wallet Wallet { get; set; } = default!;
    public string? UserId { get; set; } = default!;

    [ForeignKey("UserId")]
    [ValidateNever]
    public User User { get; set; } = default!;


}
