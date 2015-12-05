<?php
	//Start session
	session_start();

	//Holds our error message incase shit gets real
	$error='';

	//Has the login form been submitted?
	if (isset($_POST['submit'])) {
		//Did the user actually input a username and password?
		if (empty($_POST['username']) || empty($_POST['password'])) {
			$error = "Bro, did you even type anything?";
		}
		else {
			//Get the username and password provided
			$username = $_POST['username'];
			$password = $_POST['password'];

			//Connect to our SQL server
			$connection = mysql_connect("oniddb.cws.oregonstate.edu", "rogersza-db", "REMOVED");

			//So there is this thing called SQL injection... huekappahue
			$username = stripslashes($username);
			$password = stripslashes($password);
			$username = mysql_real_escape_string($username);
			$password = mysql_real_escape_string($password);

			//Get password hash
			$phash = md5($password); //Better than plain text, not secure though (MD5 Collision vectors, etc)

			//GET DA DATABASE FAM
			$db = mysql_select_db("rogersza-db", $connection);

			//Query to see if this login record exists
			$query = mysql_query("select * from login where password='$phash' AND username='$username'", $connection);
			$rows = mysql_num_rows($query);

			//If we get data, success!
			if ($rows == 1) {
				//Indicate that the login was successful
				$_SESSION['login_user'] = $username;

				//Redirect!
				header("Location: index.php");
			}
			else {
				$error = "Username/password is not valid!";
			}

			//Close SQL server connection
			mysql_close($connection);
		}
	}

	//Redirect if already logged in
	if(isset($_SESSION['login_user'])) {
	    header("Location: index.php");
	}
?>
<!DOCTYPE html>
<html>
	<head>
		<!-- General -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">

		<!-- JS -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>

		<!-- CSS -->
		<link rel="stylesheet" href="css/reset.css">
		<link rel="stylesheet" href="css/main.css">

		<!-- Fonts -->
		<link href='http://fonts.googleapis.com/css?family=Fira+Sans:400,300' rel='stylesheet' type='text/css'>
		<link href='https://fonts.googleapis.com/css?family=Halant:400,500' rel='stylesheet' type='text/css'>
		<link href="http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">

		<title>Login</title>
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
			<div class="card flex_it">
				<h3> Login </h3>

				<form action="" class="flex_it" method="post">
		            <input id="name" name="username" placeholder="Username" type="text">
		            <input id="password" name="password" placeholder="*****" type="password">
		            <input name="submit" type="submit" value=" Login ">
		            <span style="color:red;"><?php echo $error; ?></span>
		        </form>

				<br><br>
				<a href="signup.php">Don't have an account? Create one here!</a>

			  </div>
		  </div>
	</body>
</html>
