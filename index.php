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

        <title>Hi there</title>
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

            <script>displayPalettes();</script>

    	</div>

	</body>
</html>
