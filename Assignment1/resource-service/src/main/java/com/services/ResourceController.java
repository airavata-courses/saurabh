/**
 * This class exposes the REST API for creating and retrieving resources
 * Reference: https://spring.io/guides/gs/accessing-data-mysql/
 */

package com.services;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ResourceController {
  @Autowired // This means to get the bean called userRepository
  // Which is auto-generated by Spring, we will use it to handle the data
  private ResourceRepository resourceRepository;

  @PostMapping(path = "/add_resource")
  public @ResponseBody String addResource(@RequestParam("resource_string") final String resourceString) {
    Resource resource = new Resource();
    resource.setResourceString(resourceString);
    resourceRepository.save(resource);
    return "Saved";
  }

  @GetMapping(path = "/get_all_resources")
  public @ResponseBody Iterable<Resource> getAllResources() {
    return resourceRepository.findAll();
  }

  @GetMapping(path = "/get_resource")
  public @ResponseBody String getSpecificResource(@RequestParam("resource_id") final int id, HttpServletResponse response) {
    if (resourceRepository.exists(id)) {
      return resourceRepository.findOne(id).getResourceString();
    } else {
      response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
      return "Resource not found";
    }
  }
}