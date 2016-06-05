<?php
if(isset($_GET['tw']) ){
    echo file_get_contents("https://twicon.lelp.net/".$_GET['tw']);
}