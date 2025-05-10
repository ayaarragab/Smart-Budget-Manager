using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Core.Interfaces;
using Domin.DTOs;
using Domain.Models;
using Core.Services;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WalletsController : ControllerBase
    {
        private readonly IWalletService _walletService;

        public WalletsController(IWalletService walletService)
        {
            _walletService = walletService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var wallets = await _walletService.GetAllAsync();
            if (!wallets.Any())
                return NotFound("No wallets found.");

            return Ok(wallets);
        }

        [HttpGet("GetById/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var wallet = await _walletService.GetByIdAsync(id);
            if (wallet == null)
                return NotFound("Wallet not found.");

            return Ok(wallet);
        }

        [HttpPost("Add")]
        public async Task<IActionResult> Add(WalletDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _walletService.AddAsync(model);
            return Ok(new { message = "Wallet added successfully!", data = model });
        }

        [HttpPut("Update/{id}")]
        public async Task<IActionResult> Update(int id,WalletDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var Wallet = await _walletService.GetByIdAsync(id);
            if (Wallet == null)
            {
                return BadRequest("Invalid Id");
            }
            var wallet = new Wallet
            {
               
                Name = model.Name,
                Type = model.Type,
                UserId = model.UserId
            };

            await _walletService.UpdateAsync(id,model);
            return Ok(new { message = "Wallet updated successfully!", data = model });
        }

        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var wallet = await _walletService.GetByIdAsync(id);
            if (wallet == null)
                return NotFound("Wallet not found.");

            await _walletService.DeleteAsync(id);
            return Ok(new { message = "Wallet deleted successfully!" });
        }
    }
}
