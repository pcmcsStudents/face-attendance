<?php
// डेटाबेस कनेक्शनसाठी आवश्यक माहिती
$servername = "localhost"; // तुमचा डेटाबेस सर्व्हर
$username = "root"; // तुमचा डेटाबेस युजरनेम
$password = ""; // तुमचा डेटाबेस पासवर्ड
$dbname = "studentinfo"; // तुमच्या डेटाबेसचे नाव

try {
    // डेटाबेस कनेक्शन तयार करा
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // PDO एरर मोड सेट करा
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // फॉर्म डेटा घ्या
     $name = $_POST['name'] ?? '';
    $class = $_POST['class'] ?? '';
    $rollno = $_POST['rollno'] ?? '';
    $division = $_POST['division'] ?? '';
    $department = $_POST['department'] ?? '';
    $mobile = $_POST['mobile'] ?? '';
    $email = $_POST['email'] ?? '';
    $birthdate = $_POST['birthdate'] ?? '';
    $password = $_POST['password'] ?? ''; // पासवर्ड एन्क्रिप्ट करणे आवश्यक आहे.

    // इमेज डेटा
    $capturedImagesData = $_POST['captured_images_data'] ?? '';
     $capturedImages = json_decode($capturedImagesData, true);
    if ($capturedImages === null && json_last_error() !== JSON_ERROR_NONE) {
        echo "त्रुटी: इमेज डेटा डीकोड करताना समस्या आली.";
        exit;
    }

    // SQL क्वेरी तयार करा
     $sql = "INSERT INTO students (name, class, rollno, division, department, mobile, email, birthdate, password)
    VALUES (:name, :class, :rollno, :division, :department, :mobile, :email, :birthdate, :password)";

    // स्टेटमेंट तयार करा
    $stmt = $conn->prepare($sql);

    // व्हेरिएबल बाइंड करा
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':class', $class);
    $stmt->bindParam(':rollno', $rollno);
    $stmt->bindParam(':division', $division);
    $stmt->bindParam(':department', $department);
    $stmt->bindParam(':mobile', $mobile);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':birthdate', $birthdate);
    $stmt->bindParam(':password', $password); // पासवर्ड एन्क्रिप्ट करा

    // क्वेरी एक्झिक्युट करा
    $stmt->execute();

     // Get the last inserted ID
    $studentId = $conn->lastInsertId();


    // Save images if any
    $imagePaths = [];
    if (!empty($capturedImages)){
        $imageDir = "student_images/$studentId/";
        if (!is_dir($imageDir)){
             mkdir($imageDir, 0777, true);
         }
        foreach($capturedImages as $index => $imageData) {
            $imageData = str_replace('data:image/png;base64,', '', $imageData);
            $imageData = str_replace(' ', '+', $imageData);
            $imageBinary = base64_decode($imageData);
             $imagePath = $imageDir . "image_" . ($index + 1) . ".png";
             file_put_contents($imagePath, $imageBinary);
            $imagePaths[] = $imagePath;
        }

         // Save image paths to database
        $imagePathsString = implode(',', $imagePaths); // Store as comma-separated string
        $updateSql = "UPDATE students SET image_paths = :image_paths WHERE id = :studentId";
        $updateStmt = $conn->prepare($updateSql);
        $updateStmt->bindParam(':image_paths', $imagePathsString);
        $updateStmt->bindParam(':studentId', $studentId);
         $updateStmt->execute();
    }

   header("Location: login.php");
    echo "नवीन रेकॉर्ड यशस्वीरित्या तयार केले.";


} catch(PDOException $e) {
    echo "कनेक्शनमध्ये त्रुटी: " . $e->getMessage();
}

$conn = null; // कनेक्शन बंद करा
?>

