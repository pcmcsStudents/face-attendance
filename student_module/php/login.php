<?php
session_start();

// डेटाबेस कनेक्शनसाठी आवश्यक माहिती
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "studentinfo";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // फॉर्म डेटा घ्या
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
        // डेटाबेसमध्ये युजर तपासा (मोबाइल नंबर किंवा ईमेल आयडी)
        //First check in student table
    $sql = "SELECT id, password FROM students WHERE (mobile = :username OR email = :username)";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    if ($stmt->rowCount() > 0)
      {
      $user = $stmt->fetch(PDO::FETCH_ASSOC);
         //पासवर्ड compare करा
        if ($password == $user['password'])
         {
            // Login successful, Set session
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_type'] = "student";
             // Redirect to dashboard
                header("Location: student_dashboard.php");
                exit;
          }else
           {
               $errorMessage = "चुकीचा पासवर्ड.";
           }

      } else {
          //Check in teacher table
               $sqlTeacher = "SELECT id, password FROM teachers WHERE (mobile = :username OR email = :username)";
               $stmtTeacher = $conn->prepare($sqlTeacher);
              $stmtTeacher->bindParam(':username', $username);
                $stmtTeacher->execute();

        if ($stmtTeacher->rowCount() > 0) {
            $user = $stmtTeacher->fetch(PDO::FETCH_ASSOC);
                 //पासवर्ड compare करा
                 if ($password == $user['password'])
                  {
                   //Login Success
                  $_SESSION['user_id'] = $user['id'];
                 $_SESSION['user_type'] = "teacher";
                  // Redirect to dashboard
                  header("Location: teacher_dashboard.php");
                    exit;
                } else{
                   $errorMessage = "चुकीचा पासवर्ड.";
                    }
           } else{
            $errorMessage = "चुकीचा युजरनेम किंवा मोबाईल नंबर.";
          }
      }
} catch (PDOException $e) {
    $errorMessage = "कनेक्शनमध्ये त्रुटी: " . $e->getMessage();
}

$conn = null;

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>लॉग इन</title>
    <style>
        body {
            font-family: sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f0f0;
        }
        .container {
            background-color: #ffffff;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        h2 {
            margin-bottom: 20px;
        }
        input[type="text"], input[type="password"] {
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ccc;
            border-radius: 5px;
            width: 300px;
        }
        button {
            padding: 10px 20px;
            background-color: #4caf50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>लॉग इन</h2>
           <?php if(isset($errorMessage)){ ?>
             <p style="color:red"><?php echo $errorMessage; ?></p>
              <?php } ?>
        <form action="../php/login.php" method="post">
            <input type="text" name="username" placeholder="मोबाईल नंबर किंवा ईमेल" required><br>
            <input type="password" name="password" placeholder="पासवर्ड" required><br>
            <button type="submit">लॉग इन</button>
        </form>
    </div>
</body>
</html>
