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
  <link rel="stylesheet" href="../css/reset.css">
  <link rel="stylesheet" href="../css/main.css">

  <!-- Fonts -->
  <link href='http://fonts.googleapis.com/css?family=Fira+Sans:400,300' rel='stylesheet' type='text/css'>
  <link href='https://fonts.googleapis.com/css?family=Halant:400,500' rel='stylesheet' type='text/css'>
  <link href="http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">
</head>
<body>
	<a href="index.html" title="Home"><img src="images/weblogo.png" alt="logo"></a>
	<a href="https://github.com/halfsail" title="Projects">Create</a>
	<a href="https://github.com/halfsail" title="Projects">Popular</a>

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
