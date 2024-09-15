<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Content-Type: application/json");

// Permitir CORS
header("Access-Control-Allow-Origin: *"); // Permite qualquer origem; para maior segurança, especifique seu domínio
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type"); // Cabeçalhos permitidos

// Para lidar com as requisições OPTIONS (pré-verificação CORS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit; // Apenas encerra a execução para as requisições OPTIONS
}

// Conecte-se ao banco de dados
$servername = "localhost";
$username = "vincciBD";
$password = "v*incci***P*u**B2024";
$dbname = "vinccipub";

$conn = new mysqli($servername, $username, $password, $dbname);

// Verifique a conexão
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

// Pegue os dados enviados
$data = json_decode(file_get_contents("php://input"), true);

// Verifique se todos os campos necessários estão presentes
if (isset($data['cpf'], $data['nomeCompleto'], $data['email'],  $data['sexo'], $data['telefone'], $data['dataNascimento'])) {
    $cpf = $data['cpf'];
    $nomeCompleto = $data['nomeCompleto'];
    $email = $data['email'];
    $sexo = $data['sexo'];
    $telefone = $data['telefone'];
    $dataNascimento = $data['dataNascimento'];

    // Adicionar dados ao banco de dados
    $sql = "INSERT INTO users (cpf, nomeCompleto, email, senha, sexo, telefone, dataNascimento)
            VALUES ('$cpf', '$nomeCompleto', '$email', '$sexo', '$telefone', '$dataNascimento')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success", "message" => "Dados salvos com sucesso."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Erro ao salvar dados: " . $conn->error]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Dados inválisssdosss."]);
}

$conn->close();
?>
