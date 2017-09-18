import sqlite3


def is_authentic_user(user_id, user_password):
    sqlite_file = 'authentication_db.sqlite'

    table_name = 'authentications'
    user_id_field = 'user_id'
    user_password_field = 'user_password'

    # Connecting to the database file
    conn = sqlite3.connect(sqlite_file)
    curr = conn.cursor()

    query_string = '''SELECT COUNT(*) AS CNT FROM {table_name}
                      WHERE {user_id_field} = {user_id} AND {user_password_field} = "{user_password}";'''\
        .format(table_name=table_name,
                user_id_field=user_id_field,
                user_id=user_id,
                user_password_field=user_password_field,
                user_password=user_password)
    print 'query_string1 ->', query_string
    curr.execute(query_string)
    first_row = curr.fetchone()
    conn.close()
    count = first_row[0]
    if count == 1:
        return True
    else:
        return False
