/**
 * This entity class maps to the DB table 'resources'
 * 'resources' table store a secret string in the column 'resource_string'
 * 'resource_id' uniquely identifies every 'resource_string'
 */

package com.services;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity(name = "resources")
public class Resource {

  /**
   * id: uniquely identifies every resourceString
   * resourceString: store a secret string
   */

  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "resource_id")
  @Id
  private Integer id;

  @Column(name = "resource_string")
  private String resourceString;

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public String getResourceString() {
    return resourceString;
  }

  public void setResourceString(String resourceString) {
    this.resourceString = resourceString;
  }
}