using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Core.Interfaces;
using Domin.DTOs;
using Domain.Models;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionsController : ControllerBase
    {
        private readonly ITransactionService _transactionService;
        private readonly IWalletService _walletService; 
        public TransactionsController(ITransactionService transactionService, IWalletService walletService)
        {
            _transactionService = transactionService;
            _walletService = walletService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var transactions = await _transactionService.GetAllAsync();
            if (!transactions.Any())
                return NotFound("No transactions found.");

            return Ok(transactions);
        }

        [HttpGet("GetById/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var transaction = await _transactionService.GetByIdAsync(id);
            if (transaction == null)
                return NotFound("Transaction not found.");

            return Ok(transaction);
        }
        [HttpGet("GetByWalletId/{id}")]
        public async Task<IActionResult> GetByWalletId(int id)
        {
            var transaction = await _transactionService.GetByWalletId(id);
            if (transaction == null)
                return NotFound("Wallet not found.");

            return Ok(transaction);
        }

        [HttpPost("Add")]
        public async Task<IActionResult> Add(TransactionDto model)
        {
            var wallet = await _walletService.GetByIdAsync(model.WalletId);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            if (wallet == null) return BadRequest("Wallet not found");

            await _transactionService.AddAsync(model);
            return Ok(new { message = "Transaction added successfully!", data = model });
        }

        [HttpPut("Update/{id}")]
        public async Task<IActionResult> Update(int id, TransactionDto model)
        {

            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var transaction= await _transactionService.GetByIdAsync(id);
            if(transaction == null)
            {
                return BadRequest("Invalid Id");
            }

            await _transactionService.UpdateAsync(id,model);
            return Ok(new { message = "Transaction updated successfully!", data = model });
        }

        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var transaction = await _transactionService.GetByIdAsync(id);
            if (transaction == null)
                return NotFound("Transaction not found.");

            await _transactionService.DeleteAsync(id);
            return Ok(new { message = "Transaction deleted successfully!" });
        }
    }
}
