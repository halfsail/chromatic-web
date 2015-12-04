<?php
    //Start session
    session_start();

    //Connect to our SQL server
    $connection = mysql_connect("oniddb.cws.oregonstate.edu", "rogersza-db", "REMOVED");

    //Select the correct database
    $db = mysql_select_db("rogersza-db", $connection);


    if(isset($_SESSION['login_user'])) {
        //Make note of current session
        $user_check = $_SESSION['login_user'];

        //Query to pull user's information
        $info_sql = mysql_query("select fname from login where username='$user_check'", $connection);
        $row = mysql_fetch_assoc($info_sql);

        //Reference User's Firstname as the login session value
        $login_session = $row['fname'];
    }

    //Close connection to SQL server
    mysql_close($connection);
?>
