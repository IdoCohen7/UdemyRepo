using Microsoft.AspNetCore.Mvc;
using UdemyApp;

namespace UdemyApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        // GET: api/<UsersController>
        [HttpGet]
        public IEnumerable<User> Get()
        {
            return UdemyApp.User.Read();
        }

        [HttpGet("{id}")]
        public IEnumerable<Course> GetCourses(int id)
        {
            return UdemyApp.User.readUsersCourses(id);
        }

        [HttpDelete("uId/{userId}/cId/{courseId}")]
        public int Delete(int userId, int courseId)
        {
            return UdemyApp.User.RemoveCourse(userId, courseId);
        }

        // GET api/<UsersController>/5
        [HttpGet("Login")]
        public User Get(string email, string password)
        {
            return UdemyApp.User.Login(email, password);
        }

        // POST api/<UsersController>
        [HttpPost("register")]
        public bool Post([FromBody] User user)
        {
            if (user == null)
            {
                return false;
            }

            User newUser = new User(user.Name, user.Email, user.Password);
            return newUser.Register();
        }

        [HttpPost("InsertCourse")]
        public int Post(int userId, int courseId)
        {
            return UdemyApp.User.insertCourse(userId, courseId);
        }

        // PUT api/<UsersController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<UsersController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
