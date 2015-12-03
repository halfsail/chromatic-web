<?php
	//Connect to the database
	$dbc = mysqli_connect("oniddb.cws.oregonstate.edu", "rogersza-db", "REMOVED", "rogersza-db");

	//Holds our error message incase shit gets real
	$error='';
	$yolo='';

	//Was the signup form submitted?
	if (isset($_POST['submit'])) {
		//Grab the profile data from the POST
		$userName = mysqli_real_escape_string($dbc, trim($_POST['userName']));
		$password1 = mysqli_real_escape_string($dbc, trim($_POST['password1']));
		$firstName = mysqli_real_escape_string($dbc, trim($_POST['firstName']));
		$lastName = mysqli_real_escape_string($dbc, trim($_POST['lastName']));

		//Make sure the user game a username and password
		if (!empty($userName) && !empty($password1)) {

			//Make sure someone isn't already registered using this username
			$query = "SELECT * FROM login WHERE username = '$userName'";
			$data = mysqli_query($dbc, $query);

			if (mysqli_num_rows($data) == 0) {
				//The username is unique, so insert the data into the database
				$phash = md5($password1); //HASH IT BABY (Better than plaintext, though MD5 collisions are a problem...)
				$query = "INSERT INTO login (username, password, fname, lname) VALUES ('$userName', '$phash', '$firstName', '$lastName')";
				mysqli_query($dbc, $query);

				//Confirm success with the user
				$yolo = 'Your new account has been successfully created. You\'re now ready to log in!';

				mysqli_close($dbc);
			}
			else {
				// An account already exists for this username, so display an error message
				$error = 'An account already exists for this username. Please use a different one!';
				$username = "";
			}
		}
		else {
			$error = 'You must enter all of the sign-up data!';
		}
	}

	mysqli_close($dbc);
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

		<title>Sign up!</title>
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
			<div class="card">
				<h3> Sign up! </h3>

				<form method="post" action="">
					<input type="text" id="userName" name="userName" placeholder="Username" value="<?php if (!empty($userName)) echo $userName; ?>" />
					<input type="password" id="password1" name="password1" placeholder="******"/>
					<input type="text" id="firstName" name="firstName" placeholder="First Name"/>
					<input type="text" id="lastName" name="LastName" placeholder="Last Name"/>
		    		<input type="submit" value="Sign Up" name="submit" />
					<span style="color:red;"><?php echo $error; ?></span>
					<span style="color:#35af44;"><?php echo $yolo; ?></span>
				</form>

			  </div>
		  </div>
	</body>
</html>
