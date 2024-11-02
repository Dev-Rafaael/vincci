<?php
require_once __DIR__ . '/../vendor/autoload.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Configurações de conexão com o banco de dados
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

$servername = $_ENV['DB_HOST'];
$username = $_ENV['DB_USER'];
$password = $_ENV['DB_PASS'];
$dbname = $_ENV['DB_NAME'];

$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica a conexão
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

if (isset($_GET['email']) && isset($_GET['token'])) {
    $email = $_GET['email'];
    $token = $_GET['token'];

    // Verifica se o token é válido
    $stmt = $conn->prepare("SELECT * FROM usuarios WHERE email = ? AND token = ?");
    $stmt->bind_param("ss", $email, $token);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Atualiza o status de verificação
        $stmt = $conn->prepare("UPDATE usuarios SET is_verified = 1 WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();

        echo json_encode(['success' => true, 'message' => 'Conta verificada com sucesso!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Token inválido ou conta já verificada.']);
    }

    $stmt->close();
}

$conn->close();
?>
<?php
// require_once __DIR__ . '/../vendor/autoload.php';

// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type");
// header("Content-Type: application/json; charset=UTF-8");

// // Configurações de conexão com o banco de dados
// $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
// $dotenv->load();

// $servername = $_ENV['DB_HOST'];
// $username = $_ENV['DB_USER'];
// $password = $_ENV['DB_PASS'];
// $dbname = $_ENV['DB_NAME'];

// $conn = new mysqli($servername, $username, $password, $dbname);

// // Verifica a conexão
// if ($conn->connect_error) {
//     die("Conexão falhou: " . $conn->connect_error);
// }
// if (isset($_GET['email']) && isset($_GET['token'])) {
//     $email = filter_var($data->email, FILTER_SANITIZE_EMAIL);
//     $token = $_GET['token'];

//     // Verifica o token
//     $stmt = $conn->prepare("SELECT * FROM usuarios WHERE email = ? AND token = ?");
//     $stmt->bind_param("ss", $email, $token);
//     $stmt->execute();
//     $result = $stmt->get_result();

//     if ($result->num_rows > 0) {
//         // Atualiza o status de verificação e remove o token
//         $stmt = $conn->prepare("UPDATE usuarios SET is_verified = 1, token = NULL WHERE email = ?");
//         $stmt->bind_param("s", $email);
//         $stmt->execute();

//         echo json_encode(['success' => true, 'message' => 'Conta verificada com sucesso!']);
//     } else {
//         echo json_encode(['success' => false, 'message' => 'Token inválido ou conta já verificada.']);
//     }

//     $stmt->close();
// }

// $conn->close();
// ?>

