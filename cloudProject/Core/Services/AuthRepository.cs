using Core.Interfaces;
using Domin.DTOs;
using Domin.Models;
using Microsoft.AspNetCore.Identity;

namespace Core.Services
{
    public class AuthRepository : IAuthRepository
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public AuthRepository(UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
        }

        public async Task<User> RegisterAsync(RegisterDto model)
        {
            if (await UserExists(model.UserName))
                return null;

            var user = new User
            {
                UserName = model.UserName,
                Email = model.Email,
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "User");
                return user;
            }

            System.Diagnostics.Debug.WriteLine(result);
            Console.WriteLine(user == null ? "No user made" : $"User made: {user.UserName}");
            return null;
        }

        public async Task<User> LoginAsync(LoginDto model)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(model.UserName);
                if (user is not null && await _userManager.CheckPasswordAsync(user, model.Password))
                {
                    var result = await _signInManager.PasswordSignInAsync(user, model.Password, false, false);
                    if (result.Succeeded)
                    {
                        //await _userManager.AddToRoleAsync(user, "User");
                        return user;
                    }
                    return null;
                }
                return null;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<bool> UserExists(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);
            if (user != null)
                return true;

            System.Diagnostics.Debug.WriteLine(user == null ? "No user found" : $"User found: {user.UserName}");
            return false;
        }

        public  bool StoreTokenAsync(User user, string token)
        {
            _userManager.SetAuthenticationTokenAsync(user, "JWT", "Access_Token", token);
            return true;
        }
    }
}