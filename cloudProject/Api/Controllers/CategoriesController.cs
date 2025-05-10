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
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet("GetAll")]
        [Authorize(Policy = "UserPolicy")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var categories = await _categoryService.GetAllAsync();
                if (categories == null || !categories.Any())
                {
                    return NotFound(new
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "No categories found",
                    });
                }
                return Ok(new
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "",
                    Data = categories
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
                var category = await _categoryService.GetByIdAsync(id);
                if (category == null)
                {
                    return NotFound(new
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Category not found",
                    });
                }
                return Ok(new
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "",
                    Data = category
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
        //[Authorize(Policy = "UserPolicy")]
        public async Task<IActionResult> Add(CategoryDto model)
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
                        Message = "Category data can't be null",
                    });
                }
                await _categoryService.AddAsync(model);
                return Ok(new
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "",
                    alert = "Category Added Successfully!",
                    Data = model
                });
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex);
                return BadRequest(new
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = ex.Message,
                });
            }
        }

        [HttpPut("Update")]
        [Authorize(Policy = "UserPolicy")]
        public async Task<IActionResult> Update(Category model)
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

                await _categoryService.UpdateAsync(new Category
                {
                    Id = model.Id,
                    Name = model.Name,
                    UserId = model.UserId
                });
                return Ok(new
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "",
                    alert = "Category Updated Successfully!",
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
                var category = await _categoryService.GetByIdAsync(id);
                if (category == null)
                {
                    return NotFound(new
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Category not found",
                    });
                }
                await _categoryService.DeleteAsync(id);

                return Ok(new
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "",
                    alert = "Category Deleted Successfully!",
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
