<?php
require_once __DIR__ . '/../vendor/autoload.php';
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");
// Verifica se a requisição é do tipo OPTIONS e responde com o status 200
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

$servername = $_ENV['DB_HOST'];
$username = $_ENV['DB_USER'];
$password = $_ENV['DB_PASS'];
$dbname = $_ENV['DB_NAME'];


// Conectar ao banco de dados
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica a conexão
if ($conn->connect_error) {
    echo json_encode(['error' => 'Falha na conexão: ' . $conn->connect_error]);
    exit;
}

// Recebe os dados do formulário
$users_id = isset($_POST['users_id']) ? (int) $_POST['users_id'] : null;
$pacotes_id = isset($_POST['pacotes_id']) ? (int) $_POST['pacotes_id'] : null;
$quantidade = isset($_POST['quantidade']) ? (int) $_POST['quantidade'] : null;
$valor_unitario = isset($_POST['valor_unitario']) ? (float) $_POST['valor_unitario'] : null;
$valor_total = isset($_POST['valor_total']) ? (float) $_POST['valor_total'] : null;

// Verifica se todos os dados foram recebidos
if ($users_id === null || $pacotes_id === null || $quantidade === null || $valor_unitario === null || $valor_total === null) {
    echo json_encode(['error' => 'Dados do formulário incompletos.', 
                       'users_id' => $users_id,
                       'pacotes_id' => $pacotes_id,
                       'quantidade' => $quantidade,
                       'valor_unitario' => $valor_unitario,
                       'valor_total' => $valor_total]);
    exit;
}

// Insere os dados na tabela 'carrinho'
$sql = "INSERT INTO carrinho (users_id, pacotes_id, quantidade, valor_unitario, valor_total) 
        VALUES (?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("iiidd", $users_id, $pacotes_id, $quantidade, $valor_unitario, $valor_total);

if ($stmt->execute()) {
    echo json_encode(['message' => 'Item adicionado ao carrinho!']);
} else {
    echo json_encode(['error' => 'Erro ao adicionar item ao carrinho: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
