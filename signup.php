<!DOCTYPE html>
<html>
<head>
	<title>Sign Up</title>
	  <!-- CSS -->
  <link rel="stylesheet" href="/css/reset.css">
  <link rel="stylesheet" href="/css/main.css">

  <!-- Fonts -->
  <link href='http://fonts.googleapis.com/css?family=Fira+Sans:400,300' rel='stylesheet' type='text/css'>
  <link href='https://fonts.googleapis.com/css?family=Halant:400,500' rel='stylesheet' type='text/css'>
  <link href="http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">
</head>
<body>
	<a href="index.html" title="Home"><img src="images/weblogo.png" alt="logo"></a>
	<a href="https://github.com/halfsail" title="Projects">Create</a>
	<a href="https://github.com/halfsail" title="Projects">Popular</a>
	<a href="login.php" title="Projects">login</a>

<div class=flex_con>
<div class=mini>
  <h3>Sign Up</h3>


  <form method="post" action="signup.php">

      <input type="text" id="userName" name="userName" placeholder="Use Name" value="" /><br />
      <input type="password" id="password1" name="password1" placeholder="Password"><br>


    <input type="submit" value="Sign Up" name="submit" />
  </form>
</div>
</div>
</body>
</html>
