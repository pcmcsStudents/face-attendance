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
     $sql = "SELECT id, password FROM teachers WHERE (mobile = :username OR email = :username)";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':username', $username);
    $stmt->execute();


   if ($stmt->rowCount() > 0) {
      $user = $stmt->fetch(PDO::FETCH_ASSOC);
         //पासवर्ड compare करा
        if ($password == $user['password'])
        {
            // लॉगिन यशस्वी
            $_SESSION['user_id'] = $user['id'];
             // डॅशबोर्डवर रीडायरेक्ट करा
              header("Location: teacher_dashboard.php");
                exit;
         }else {
                 $errorMessage = "चुकीचा पासवर्ड.";
        }
    } else {
        $errorMessage = "चुकीचा युजरनेम किंवा मोबाईल नंबर.";
    }


} catch (PDOException $e) {
    $errorMessage = "कनेक्शनमध्ये त्रुटी: " . $e->getMessage();
}
$conn = null;
?>