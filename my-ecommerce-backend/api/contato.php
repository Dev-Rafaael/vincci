<?php
require '../vendor/autoload.php'; // Certifique-se de que o autoload do Composer esteja carregado

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

$servername = $_ENV['DB_HOST'];
$username = $_ENV['DB_USER'];
$password = $_ENV['DB_PASS'];
$dbname = $_ENV['DB_NAME'];

$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica a conexão
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

// Recebe os dados da requisição POST
$input = file_get_contents('php://input');
$data = json_decode($input, true);

$nome = $data['nome'];
$email = $data['email'];
$telefone = $data['telefone'];
$mensagem = $data['mensagem'];


// Insere os dados no banco de dados
$sql = $conn->prepare("INSERT INTO tabela_contato (nome, email, telefone, mensagem) VALUES (?, ?, ?, ?)");
$sql->bind_param("ssss", $nome, $email, $telefone, $mensagem);

if ($sql->execute()) {
    echo json_encode(['message' => 'Dados inseridos com sucesso']);
} else {
    echo json_encode(['message' => 'Erro: ' . $conn->error]);
}

// if (isset($data['nome']) && isset($data['email']) && isset($data['telefone']) && isset($data['mensagem'])) {
//     $nome = $data['nome'];
//     $email = $data['email'];
//     $telefone = $data['telefone'];
//     $mensagem = $data['mensagem'];

//     // Verifica se os campos estão preenchidos
//     if (!empty($nome) && !empty($email) && !empty($telefone) && !empty($mensagem)) {
//         // Lógica para inserir no banco de dados
//     } else {
//         echo json_encode(["message" => "Campos vazios!"]);
//     }
// } else {
//     echo json_encode(["message" => "Nenhum dado enviado!"]);
// }
$conn->close();
?>