using Microsoft.AspNetCore.Mvc;
using UdemyApp;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace UdemyApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InstructorsController : ControllerBase
    {
        // GET: api/<InstructorsController>
        [HttpGet]
        public IEnumerable<Instructor> Get()
        {
            return Instructor.Read();
        }

        [HttpGet("{id}/courses")]
        public IActionResult GetCourses(int id)
        {
            DBservices dBservices = new DBservices();
            var courses = dBservices.ReadInstructorsCourses(id);

            if (courses == null || courses.Count == 0)
            {
                return NotFound(); // Return 404 if no courses found
            }

            return Ok(courses);
        }

        // GET api/<InstructorsController>/5
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var instructor = Instructor.Read().FirstOrDefault(inst => inst.Id == id);

            if (instructor == null)
            {
                return NotFound(); // Return 404 
            }

            return Ok(instructor); 
        }

        // POST api/<InstructorsController>
        [HttpPost]
        public bool Post([FromBody] Instructor instructor)
        {
            return true;
        }

        // PUT api/<InstructorsController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<InstructorsController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
