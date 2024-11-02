<?php
require_once __DIR__ . '/../vendor/autoload.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Carregar variáveis de ambiente
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// Verifica o método HTTP
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Método inválido."]);
    exit;
}

// Conexão com o banco de dados
$servername = $_ENV['DB_HOST'];
$username = $_ENV['DB_USER'];
$password = $_ENV['DB_PASS'];
$dbname = $_ENV['DB_NAME'];

$conn = new mysqli($servername, $username, $password, $dbname);

// Verificando a conexão
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Falha na conexão com o banco de dados."]));
}

// Capturando os dados enviados via POST (JSON)
$data = json_decode(file_get_contents('php://input'), true);
$email = isset($data['email']) ? trim($data['email']) : '';
$senha = isset($data['senha']) ? trim($data['senha']) : '';

// Validar e sanitizar entradas
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => "error", "message" => "Email inválido"]);
    exit;
}

// Verificar se o email e a senha foram preenchidos
if (!empty($email) && !empty($senha)) {
    // Preparar a consulta SQL para verificar se o usuário existe
    $stmt = $conn->prepare("SELECT senha, nome_completo, data_nascimento, sexo FROM usuarios WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    // Verificar se o usuário foi encontrado
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        
        // Verificar a senha usando password_verify
        if (password_verify($senha, $user['senha'])) {
            unset($user['senha']); // Remove a senha do array de retorno
            echo json_encode(["status" => "success", "user" => $user]);
        } else {
            echo json_encode(["status" => "error", "message" => "Senha incorreta"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Usuário não encontrado"]);
    }

    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Email ou senha não foram preenchidos"]);
}

// Fechar a conexão
$conn->close();
?>


<?php
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type");
// header("Content-Type: application/json; charset=UTF-8");

// $servername = "localhost";
// $username = "vincciBD";
// $password = "v*incci***P*u**B2024";
// $dbname = "vinccipub";

// // Criando a conexão
// $conn = new mysqli($servername, $username, $password, $dbname);

// // Verificando a conexão
// if ($conn->connect_error) {
//     die(json_encode(["status" => "error", "message" => "Falha na conexão com o banco de dados: " . $conn->connect_error]));
// }

// // Capturando os dados enviados via POST (JSON)
// $data = json_decode(file_get_contents('php://input'), true);
// $nome_completo = isset($data['nome_completo']) ? $data['nome_completo'] : '';
// $data_nascimento = isset($data['data_nascimento']) ? $data['data_nascimento'] : '';
// $sexo = isset($data['sexo']) ? $data['sexo'] : '';
// $email = isset($data['email']) ? $data['email'] : '';
// $senha = isset($data['senha']) ? $data['senha'] : '';

// // Verificar se o email e a senha foram preenchidos
// if (!empty($email) && !empty($senha)) {
//     // Preparar a consulta SQL para verificar se o usuário existe
//     $stmt = $conn->prepare("SELECT * FROM usuarios WHERE email = ? AND senha = ? AND nome_completo = ? AND data_nascimento = ? AND sexo = ?");
    
//     // Certifique-se de que o bind_param tenha o número correto de tipos de dados
//     $stmt->bind_param("sssss", $email, $senha, $nome_completo, $data_nascimento, $sexo);
//     $stmt->execute();
//     $result = $stmt->get_result();

//     // Verificar se o usuário foi encontrado
//     if ($result->num_rows > 0) {
//         $user = $result->fetch_assoc();
//         echo json_encode(["status" => "success", "user" => $user]);
//     } else {
//         echo json_encode(["status" => "not_found", "message" => "Usuário não encontrado"]);
//     }

//     $stmt->close();
// } else {
//     echo json_encode(["status" => "error", "message" => "Email ou senha não foram preenchidos"]);
// }

// // Fechar a conexão
// $conn->close();
// ?>
