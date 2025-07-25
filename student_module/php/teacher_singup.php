<?php
// डेटाबेस कनेक्शनसाठी आवश्यक माहिती
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "studentsdata";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // फॉर्म डेटा घ्या
    $name = $_POST['name'] ?? '';
    $department = $_POST['department'] ?? '';
    $mobile = $_POST['mobile'] ?? '';
    $email = $_POST['email'] ?? '';
    $birthdate = $_POST['birthdate'] ?? '';
    $password = $_POST['password'] ?? ''; // पासवर्ड एन्क्रिप्ट करा

    // SQL क्वेरी तयार करा
    $sql = "INSERT INTO teachers (name, department, mobile, email, birthdate, password)
    VALUES (:name, :department, :mobile, :email, :birthdate, :password)";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':department', $department);
    $stmt->bindParam(':mobile', $mobile);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':birthdate', $birthdate);
    $stmt->bindParam(':password', $password);

    $stmt->execute();

     echo "नवीन शिक्षक रेकॉर्ड यशस्वीरित्या तयार केले.";
    header("Location: login.php");
} catch (PDOException $e) {
    echo "कनेक्शनमध्ये त्रुटी: " . $e->getMessage();
}

$conn = null;
?>