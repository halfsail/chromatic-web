<?php
    include('session.php');

    //Only process if user is logged in!
    if (isset($login_session)) {
        if (isset($_POST['fav'])) {

            //Create connection
            $conn = new mysqli("oniddb.cws.oregonstate.edu", "rogersza-db", "REMOVED", "rogersza-db");

            //Check connection
            if ($conn->connect_error) {
                die("Connection failed: " . $conn->connect_error);
            }

            //Query to see if this palette is already in our popular table
            $palette = $_POST['fav'];
            $sql = "SELECT * FROM popular WHERE name = '$palette'";
            $result = $conn->query($sql);

            //Update palette fav count
            if ($result->num_rows > 0) {
                //Get old fav count
                $old_fav = 0;
                while($row = $result->fetch_assoc()) {
                    $old_fav = $row["favs"];
                }

                //Update with new fav count
                $new_fav = $old_fav + 1;

                $sql = "UPDATE popular SET favs = '$new_fav' WHERE name = '$palette'";
                $result = $conn->query($sql);

            }

            //Input new palette and fav count
            else {
                $fav = 1;
                $sql = "INSERT INTO popular (name, favs) VALUES ('$palette', '$fav')";
                $result = $conn->query($sql);
            }

            //Query to see if this user already has this in their favs
            $user = $_SESSION['login_user'];
            $sql = "SELECT * FROM favs WHERE user = '$user' AND palette = '$palette'";
            $result = $conn->query($sql);

            //Add to favs only if it doesn't exist already
            if (!($result->num_rows > 0)) {
                $sql = "INSERT INTO favs (user, palette) VALUES ('$user', '$palette')";
                $result = $conn->query($sql);
            }

            $conn->close();

        }
    }
?>
