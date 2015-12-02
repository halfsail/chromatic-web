<?php

	session_start();
//sql commad for leaderboard
//SELECT * FROM `Users` ORDER BY wins DESC;
	$dbhost = 'oniddb.cws.oregonstate.edu';
	$dbname = 'feyderk-db';
	$dbuser = 'feyderk-db';
	$dbpass = 'mziERchisw1WVmMi';
	$dbtable = 'Users';

	$conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
if(!$conn){
    		die("connection failed".mysqli_connect_error());
		}


	if ((isset($_POST['userName'])) && (isset($_POST['password'])) ){
		$userName = $_POST['userName'];
		$password = $_POST['password'];

		$dbc = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
		if (!$dbc) {
			die('Could not connect: ');
		}

		$query = "SELECT * FROM Users WHERE userName='$userName' and password='$password'";
		$result = mysqli_query($dbc, $query);

		if (mysqli_num_rows($result) == 1) {

			// The log-in is OK so set the user ID and username session vars (and cookies), and redirect to the home page
			  $row = mysqli_fetch_array($result);
			  $_SESSION['firstName'] = $row['firstName'];
			  $_SESSION['valid_user'] = $row['userName'];
			}
		else {
          // The username/password are incorrect so set an error message
			echo "Sorry, you must enter a valid username and password to log in.";
		}
		mysqli_free_result($result);
		mysqli_close($dbc);
	}
?>
<!DOCTYPE html>
<html>
<head>
  <!-- <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"> -->
  <title>Hi there</title>
  <meta name="viewport" content="width=device-width">

  <!-- CSS -->
  <link rel="stylesheet" href="/css/reset.css">
  <link rel="stylesheet" href="/css/main.css">

  <!-- Fonts -->
  <link href='http://fonts.googleapis.com/css?family=Fira+Sans:400,300' rel='stylesheet' type='text/css'>
  <link href='https://fonts.googleapis.com/css?family=Halant:400,500' rel='stylesheet' type='text/css'>
  <link href="http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">
</head>
<body>
    <nav>
      <a href="rockpaperscissors2.php" title="Game">Game</a>
      <a href="leaderboard.php" title="Game">leaderboard</a>
      <a href="signup.php" title="Create">Create Account</a>
    </nav>

	<div class=flex_con>

	<div class=card>

          <h3> Login</h3>
		<?php

          	if (isset($_SESSION['valid_user'])) {
          		echo " <h5> You are logged in as </h5><p> User: ".$_SESSION['valid_user'];
          		echo "<p> <a href='logout.php'>Log out </a><br />";
          	}
          	else {
          		if (isset($userName)) {
          			// user tried but can't log in
          			echo "<h6> Could not log you in </h6>";
          		} else {
          			// user has not tried
          			echo " <h6> You need to log in </h6> ";
          		}
          		// Log in form

          		echo " <form method='post' action='rockpaperscissors2.php' > ";
          		echo " <input type='text' name='userName' placeholder='User Name'> <br /> ";
          		echo " <input type='password' name='password' placeholder='Password' /> <br />";
          		echo ' <input type="submit" value="Log In" name="submit" />';
          		echo "</form>";
			//echo " <a href='signup.php'>Sign Up Section </a> "
          	}
          ?>
          <a href='signup.php'>Don't have an account? Create one here </a>
</div>

	</div>
	<script src="logic.js" type="text/javascript"></script>
</body>
</html>
