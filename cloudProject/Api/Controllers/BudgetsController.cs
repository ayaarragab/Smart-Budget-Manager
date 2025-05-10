using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Core.Interfaces;
using Domin.DTOs;
using Domin.Models;
using Microsoft.AspNetCore.Authorization;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BudgetsController : ControllerBase
    {
        private readonly IBudgetService _budgetService;

        public BudgetsController(IBudgetService budgetService)
        {
            _budgetService = budgetService;
        }

        [HttpGet("GetAll")]
        [Authorize(Policy = "UserPolicy")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var budgets = await _budgetService.GetAllAsync();
                if (budgets == null || !budgets.Any())
                {
                    return NotFound(new
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "No budgets found",
                    });
                }
                return Ok(new
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "",
                    Data = budgets
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = ex.Message,
                });
            }
        }

        [HttpGet("GetById/{id}")]
        [Authorize(Policy = "UserPolicy")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var budget = await _budgetService.GetByIdAsync(id);
                if (budget == null)
                {
                    return NotFound(new
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Budget not found",
                    });
                }
                return Ok(new
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "",
                    Data = budget
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = ex.Message,
                });
            }
        }

        [HttpPost("Add")]
        [Authorize(Policy = "UserPolicy")]
        public async Task<IActionResult> Add(BudgetDto model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        StatusCode = StatusCodes.Status400BadRequest,
                        Message = "ModelStateError",
                        Errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)
                    });
                }
                if (model == null)
                {
                    return BadRequest(new
                    {
                        StatusCode = StatusCodes.Status400BadRequest,
                        Message = "Budget data can't be null",
                    });
                }
                await _budgetService.AddAsync(model);
                return Ok(new
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "",
                    alert = "Budget Added Successfully!",
                    Data = model
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = ex.Message,
                });
            }
        }

        [HttpPut("Update")]
        [Authorize(Policy = "UserPolicy")]
        public async Task<IActionResult> Update(Budget model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        StatusCode = StatusCodes.Status400BadRequest,
                        Message = "ModelStateError",
                        Errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)
                    });
                }

                await _budgetService.UpdateAsync(new Budget
                {
                    Id = model.Id,
                    Name = model.Name,
                    Amount = model.Amount,
                    //CategoryId = model.CategoryId,
                    UserId = model.UserId,
                    StartDate = model.StartDate,
                    EndDate = model.EndDate
                });
                return Ok(new
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "",
                    alert = "Budget Updated Successfully!",
                    Data = model
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = ex.Message,
                });
            }
        }

        [HttpDelete("Delete/{id}")]
        [Authorize(Policy = "UserPolicy")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var budget = await _budgetService.GetByIdAsync(id);
                if (budget == null)
                {
                    return NotFound(new
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Budget not found",
                    });
                }
                await _budgetService.DeleteAsync(id);

                return Ok(new
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "",
                    alert = "Budget Deleted Successfully!",
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = ex.Message,
                });
            }
        }
    }
}


