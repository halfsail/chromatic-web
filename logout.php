<?php
	session_start();
	$old_user = $_SESSION['valid_user'];
	unset($_SESSION['valid_user']);
	session_destroy();
?>

<!DOCTYPE html>
<html>
<head>
	<title>Sign Up</title>
	  <!-- CSS -->
  <link rel="stylesheet" href="reset.css">
  <link rel="stylesheet" href="main.css">

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
<div class=mini>

		<h4> Log Out Page</h4>
	<?php
		if (!empty($old_user)) {
			echo 'User: '.$old_user.' is logged out';
		} else {
			echo 'You were not logged in!';
		}
	?>
	<a href="rockpaperscissors2.php">login here</a>

</div>
</div>
</body>
</html>
