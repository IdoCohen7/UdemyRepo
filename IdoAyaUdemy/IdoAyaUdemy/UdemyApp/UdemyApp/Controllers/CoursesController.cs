using Microsoft.AspNetCore.Mvc;
using UdemyApp;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace UdemyApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoursesController : ControllerBase
    {
        // GET: api/<CoursesController>
        [HttpGet]
        public IEnumerable<Course> Get()
        {
            return Course.Read();
        }

        // GET api/<CoursesController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<CoursesController>
        [HttpPost]
        public bool Post([FromBody] Course course)
        {
            return course.Insert();
        }

        // PUT api/<CoursesController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<CoursesController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
           bool success = false;
           Course toDelete = null;
           foreach (Course course in Course.Read())
            {
                if (course.Id == id) { 
                    toDelete = course;
                }
            }
           if (toDelete != null)
            {
                toDelete.Delete();
                success = true;
            }
           if (!success)
            {
                
            }
        }

        [HttpGet("getByDurationRange")]

        public IEnumerable<Course> GetByDurationRange(double start, double end)
        {
            return Course.GetByDurationRange(start, end);
        }

        [HttpGet("getByRatingRange/start/{start}/end/{end}")]

        public IEnumerable<Course> GetByRatingRange(double start, double end)
        {
            return Course.GetByRatingRange(start, end);
        }




    }
}
