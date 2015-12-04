<?php
	//Include session info script
	include('session.php');
?>

<nav>
	<a href="index.php" title="Home"><img src="images/weblogo.png" alt="logo"></a>

	<?php
		//Navigation if user is logged in
		if (isset($login_session)) {
			echo '<a href="index.php" title="You">Hello, '.$login_session.'!</a>';
			echo '<a href="popular.php" title="Popular">Popular</a>';
			echo '<a href="fav.php" title="Favorites">Favorites</a>';
		    echo '<a href="logout.php" title="Logout">Logout</a>';
		}

		//If user is not logged in
		else {
			echo '<a href="popular.php" title="Popular">Popular</a>';
		    echo '<a href="login.php" title="Login">Login</a>';
		    echo '<a href="signup.php" title="Signup">Sign Up</a>';
		}
	?>
</nav>
