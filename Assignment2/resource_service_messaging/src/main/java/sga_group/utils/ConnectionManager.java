package sga_group.utils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConnectionManager {
/*	private static String dbUrl = 
			"jdbc:mysql://localhost:3306/resource-db?autoReconnect=true&useSSL=false";
	private static String dbUsername = "resource_user";
	private static String dbPassword = "password";
	private static Connection connection = null;

	public static Connection getConnection() throws SQLException {
	  if (connection == null) {
	    connection = DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
	  }
	  return connection;
	}*/
  private static String dbUrl = 
      "jdbc:mysql://localhost:3306/resource-db?autoReconnect=true&useSSL=false";
  private static String dbUsername = "resource_user";
  private static String dbPassword = "password";

  public static Connection getConnection() throws SQLException {
    return DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
  }
}
