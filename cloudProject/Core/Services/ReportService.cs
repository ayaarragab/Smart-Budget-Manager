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
    public class ReportService : IReportService
    {
        private readonly IUintOfWork _unitOfWork;
        public ReportService(IUintOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public  async Task AddAsync(ReportDto model)
        {
             Report report=new Report();
            report.to=model.to; 
            report.from=model.from; 
            report.UserId=model.UserId; 
            report.Desctiption=model.Desctiption;   
            var transaction = await _unitOfWork.transactions.GetByDate(model.from,model.to);
            foreach (var item in transaction)
            {
                var wallet = await _unitOfWork.wallets.GetByIdAsync(item.WalletId);
                if (wallet.UserId == model.UserId)
                {
                    if (item.Type == TransactionType.Income)
                    {
                        report.TotalIncome += item.Amount;
                    }
                    else
                    {
                        report.TotalExpense += item.Amount;
                    }

                }

            }
            await _unitOfWork.reports.AddAsync(report);
            await _unitOfWork.SaveChangesAsync();
        }

        public async  Task DeleteAsync(int id)
        {
            await _unitOfWork.reports.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task<IEnumerable<Report>> GetAllAsync()
        {
            return await _unitOfWork.reports.GetAllAsync();
        }

        public async Task<Report> GetByIdAsync(int id)
        {
            var report = await _unitOfWork.reports.GetByIdAsync(id);
            if (report == null)
                throw new Exception($"report with id {id} not found");
            return report;
        }

        public async Task UpdateAsync(int id,ReportDto model)
        {


            var report = await _unitOfWork.reports.GetByIdAsync(id);
            if (report == null)
                throw new Exception($"report with id {id} not found");


            report.UserId = model.UserId;
            report.Desctiption = model.Desctiption;
            decimal income = 0;
            decimal expense=0;
            var transaction = await _unitOfWork.transactions.GetByDate(model.from, model.to);
            foreach (var item in transaction)
            {
                var wallet = await _unitOfWork.wallets.GetByIdAsync(item.WalletId);
                if (wallet.UserId == model.UserId)
                {
                    if (item.Type == TransactionType.Income)
                    {
                        income += item.Amount;
                    }
                    else
                    {
                        expense += item.Amount;
                    }

                }

            }
            report.from=model.from;  
            report.to=model.to;
            report.TotalExpense = expense;  
            report.TotalIncome = income;    
            report.Desctiption=model.Desctiption;   
            await _unitOfWork.SaveChangesAsync();
        }
        public async Task<IEnumerable<Report>> GetByUserId(string id)
        {
            var report = await _unitOfWork.reports.GetByUserId(id);
            if (report == null)
                throw new Exception($"report with userid {id} not found");
            return report;
        }
    }
}
