package sga_group.resource_service_messaging;

import com.rabbitmq.client.AMQP;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Consumer;
import com.rabbitmq.client.DefaultConsumer;
import com.rabbitmq.client.Envelope;

import java.io.IOException;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import sga_group.utils.ConnectionManager;

public class Server {

  private static final String RPC_QUEUE_NAME = "resource_queue";

  private static String getResourceString(String resourceId) throws SQLException {
    System.out.println("Resource ID -> " + resourceId);
    java.sql.Connection sqlConnection = ConnectionManager.getConnection();
    String query = "SELECT resource_string FROM resources WHERE resource_id=?;";
    PreparedStatement pstmt = sqlConnection.prepareStatement(query);
    pstmt.setString(1, resourceId);
    ResultSet rs = pstmt.executeQuery();
    if (rs.next()) {
      return rs.getString(1);
      } else {
        return "Bad resource ID";
    }
  }

  public static void main(String[] args) {
    ConnectionFactory factory = new ConnectionFactory();
    factory.setUsername("new_user");
    factory.setPassword("password");
    factory.setVirtualHost("/");
    factory.setHost("149.165.169.11");
    factory.setPort(5672);

    try (com.rabbitmq.client.Connection rabbitMqConnection = factory.newConnection()) {
      final Channel channel = rabbitMqConnection.createChannel();
      channel.queueDeclare(RPC_QUEUE_NAME, false, false, false, null);
      channel.basicQos(1);

      System.out.println(" [x] Awaiting RPC requests");

      Consumer consumer = new DefaultConsumer(channel) {
        @Override
        public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body)
            throws IOException {
          AMQP.BasicProperties replyProps = new AMQP.BasicProperties.Builder()
              .correlationId(properties.getCorrelationId()).build();

          String response = "";
          try {
            String resourceId = new String(body, "UTF-8");
            response = getResourceString(resourceId);
          } catch (RuntimeException e) {
            System.err.println(" [.] " + e.toString());
          } catch (SQLException e) {
            System.err.println("SQL exception occurred: " + e.getMessage());
            e.printStackTrace();
          } finally {
            channel.basicPublish("", properties.getReplyTo(), replyProps, response.getBytes("UTF-8"));
            channel.basicAck(envelope.getDeliveryTag(), false);
          }
        }
      };

      channel.basicConsume(RPC_QUEUE_NAME, false, consumer);

      // loop to prevent reaching finally block
      while (true) {
        try {
          Thread.sleep(100);
        } catch (InterruptedException ie) {
          System.err.println("InterruptedException occurred: " + ie.getMessage());
          ie.printStackTrace();
        }
      }
    } catch (Exception e) {
      System.err.println("Exception occurrred: " + e.getMessage());
      e.printStackTrace();
    }
  }
}