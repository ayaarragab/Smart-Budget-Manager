using Core.Interfaces;
using Domain.Models;
using Domin.DTOs;
using Infrastructure.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Core.Services
{
     public class TransactionService: ITransactionService
    {
        private readonly IUintOfWork _unitOfWork;

        public TransactionService(IUintOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Transaction>> GetAllAsync()
        {
            return await _unitOfWork.transactions.GetAllAsync();
        }
        public async Task<IEnumerable<Transaction>> GetByWalletId(int id)
        {
         var transaction= await _unitOfWork.transactions.GetByWalletId(id);
            if (transaction == null) throw new Exception($"Wallet with id {id} not found");
            return transaction; 
        }


        public async Task<Transaction> GetByIdAsync(int id)
        {
            var transaction = await _unitOfWork.transactions.GetByIdAsync(id);
            if (transaction == null)
                throw new Exception($"Transaction with id {id} not found");
            return transaction;
        }

        public async Task AddAsync(TransactionDto model)
        {
            var wallet = await _unitOfWork.wallets.GetByIdAsync(model.WalletId);
            if (wallet == null) throw new Exception("Wallet not found");
            if (model.Type == TransactionType.Income)
            {
                wallet.Balance += model.Amount;
            }
            if (model.Type == TransactionType.Expense)
            {
                if (wallet.Balance >= model.Amount)
                    wallet.Balance -= model.Amount;
                else throw new Exception("Invalid transaction");
            }
            var transaction = new Transaction
            {
                Amount = model.Amount,
                CategoryId = model.CategoryId,
                Date = model.Date,
                WalletId = model.WalletId,
                Type = model.Type,
                Description = model.Description,
                UserId = model.UserId,
            };
            await _unitOfWork.wallets.UpdateAsync(wallet);
            await _unitOfWork.transactions.AddAsync(transaction);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task UpdateAsync(int id, TransactionDto model)
        {
            var transaction = await _unitOfWork.transactions.GetByIdAsync(id);
            if (transaction == null)
                throw new Exception($"Transaction with id {id} not found");


            transaction.Amount = model.Amount;
            transaction.CategoryId = model.CategoryId;
            transaction.Date = model.Date;
            transaction.WalletId = model.WalletId;  
            transaction.Type = model.Type;  
            transaction.Description = model.Description;    

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            await _unitOfWork.transactions.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();
        }
        public async Task<IEnumerable<Transaction>> GetByDate(DateTime from, DateTime to)
        {
            var transaction = await _unitOfWork.transactions.GetByDate(from, to);

            return transaction;
        }

        public async Task<IEnumerable<Transaction>> GetByUserIdAsync(string userId)
        {
            var transactions = await _unitOfWork.transactions.GetByUserId(userId);
            return transactions;
        }

    }
}
