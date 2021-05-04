<!DOCTYPE html>
<html>
<body>

<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST')
{
if($_POST["pwd"]=="gulppull123")
{
echo "file created";
$file = fopen("fixmail","w");
fclose($file);
}
else
{
echo "no<br><br>";
}

}
?>


<form action="/dev-fixmail.php" method="post">
  ?:<br>
  <input type="password" name="pwd">
  <br>
  <input type="submit" value="Submit">
</form> 


</body>
</html>
