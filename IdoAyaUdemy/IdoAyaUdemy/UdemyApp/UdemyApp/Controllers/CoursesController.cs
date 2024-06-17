using Microsoft.AspNetCore.Mvc;
using System;
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
        public Course Get(int id)
        {
            DBservices dbs = new DBservices();
            return dbs.GetCourse(id);
        }

        // POST api/<CoursesController>
        [HttpPost]
        public int Post([FromBody] Course course)
        {
            DBservices dBservices = new DBservices();
            Course newCourse = new Course(course.Title, course.Url, 0, 0, course.InstructorId, course.ImageRef, course.Duration);
            return dBservices.CreateCourse(newCourse);
        }


        // PUT api/<CoursesController>/5
        [HttpPut()]
        public bool Put([FromBody] Course updatedValue)
            {
            if (updatedValue != null)
            {
                DBservices dbs = new DBservices();
                dbs.EditCourse(updatedValue);
                return true;

            }
            return false;
        }

        // DELETE api/<CoursesController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
      
        }

        [HttpGet("getByDurationRange")]

        public IEnumerable<Course> GetByDurationRange(int id, float start, float end)
        {
            return Course.GetCoursesByDuration(id, start, end);
        }

        [HttpGet("getByRatingRange/id/{id}/start/{start}/end/{end}")]

        public IEnumerable<Course> GetByRatingRange(int id, float start, float end)
        {
            return Course.GetCoursesByRating(id, start, end);
        }




    }
}
