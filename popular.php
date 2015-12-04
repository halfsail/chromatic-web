<!DOCTYPE html>
<html>
    <head>
        <!-- General -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">

        <!-- JS -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
        <script src="chromatic.js"></script>

        <!-- CSS -->
        <link rel="stylesheet" href="css/reset.css">
        <link rel="stylesheet" href="css/main.css">

        <!-- Fonts -->
        <link href='http://fonts.googleapis.com/css?family=Fira+Sans:400,300' rel='stylesheet' type='text/css'>
        <link href='https://fonts.googleapis.com/css?family=Halant:400,500' rel='stylesheet' type='text/css'>
        <link href="http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">

        <title>Popular</title>
    </head>

	<body>
        <div id="top-bar">
            <div id="color1"></div>
            <div id="color2"></div>
            <div id="color3"></div>
            <div id="color4"></div>
        </div>

        <?php
			include('nav.php');
		?>

        <div class="flex_con">
            <div id="fade" class="black_overlay" onclick ="closeExpand()"></div>

            <?php
                //Start session
                session_start();

                //Connect to our SQL server
                $connection = mysql_connect("oniddb.cws.oregonstate.edu", "rogersza-db", "REMOVED");

                //Select the correct database
                $db = mysql_select_db("rogersza-db", $connection);

                //Query to pull list of popular palettes!
                $info_sql = mysql_query("select * from popular order by favs desc", $connection);

                //Did we get anything?
                if(mysql_num_rows($info_sql) > 0) {
                    //Go through all enteries
                    while ($row = mysql_fetch_assoc($info_sql)) {
                        echo "<script>displayPalette(\"" . $row["name"]  . "\");</script>";
                        echo "<script>defineFavs(\"" . $row["name"]  . "\", \"" . $row["favs"] . "\", \"true\");</script>";
                    }
                }

                //GC
                mysql_free_result($info_sql);

                //Close connection to SQL server
                mysql_close($connection);
            ?>

    	</div>

	</body>
</html>
