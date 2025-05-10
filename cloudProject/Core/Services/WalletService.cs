using Core.Interfaces;
using Domain.Models;
using Domin.DTOs;
using Domin.Models;
using Infrastructure.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Services
{
    public class WalletService:IWalletService
    {
        private readonly IUintOfWork _unitOfWork;
        public WalletService(IUintOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Wallet>> GetAllAsync()
        {
            return await _unitOfWork.wallets.GetAllAsync();
        }

        public async Task<Wallet> GetByIdAsync(int id)
        {
            var wallet = await _unitOfWork.wallets.GetByIdAsync(id);
            if (wallet == null)
                throw new Exception($"Wallet with id {id} not found");
            return wallet;
        }
        public async Task<IEnumerable<Wallet>> GetByUserId(string id)
        {
            var wallet = await _unitOfWork.wallets.GetByUserId(id);
            if (wallet == null)
                throw new Exception($"Wallet with userid {id} not found");
            return wallet;
        }

        public async Task AddAsync(WalletDto model)
        {
            var Wallet = new Wallet
            {
                Name = model.Name,
                Type = model.Type,
                UserId = model.UserId
            };
            await _unitOfWork.wallets.AddAsync(Wallet);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task UpdateAsync(int id,WalletDto model)
        {
            var Wallet = await _unitOfWork.wallets.GetByIdAsync(id);
            if (Wallet == null)
                throw new Exception($"Wallet with id {id} not found");

            Wallet.Name = model.Name;
            Wallet.Type = model.Type;
            Wallet.UserId = model.UserId;
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            await _unitOfWork.wallets.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task<IEnumerable<Wallet>> GetByDate(DateTime from, DateTime to)
        {
            var wallet = await _unitOfWork.wallets.GetByDate(from,to);
           
            return wallet;
        }
    }
}
