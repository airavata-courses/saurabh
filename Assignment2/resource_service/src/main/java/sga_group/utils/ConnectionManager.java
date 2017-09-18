package sga_group.utils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class ConnectionManager {

  private static final String DB_URL = "jdbc:sqlite::memory:";
  private static Connection connection;
  
  static {
    createDatabase();
  }

  public static void createDatabase() {
    final String createTable = "CREATE TABLE resources (" +
                                 "resource_id INTEGER, resource_string TEXT" + 
                               ")";
    final String insertRow = "INSERT INTO resources(resource_id, resource_string) " +
                               "VALUES (1, 'resource1:secret1'), (2, 'resource2:secret2');";
    try {
      connection = DriverManager.getConnection(DB_URL);
      try (Statement stmt = connection.createStatement()) {
        stmt.execute(createTable);
        stmt.execute(insertRow);
      }
    } catch (SQLException e) {
      System.out.println(e.getMessage());
    }
  }

  public static Connection getConnection() throws SQLException {
    return connection;
  }
}
