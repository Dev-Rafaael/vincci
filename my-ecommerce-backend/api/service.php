<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

$servername = "localhost";
$username = "vincciBD";
$password = "v*incci***P*u**B2024";
$dbname = "vinccipub";

// Cria conexão
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica a conexão
if ($conn->connect_error) {
    echo json_encode(['error' => 'Conexão falhou: ' . $conn->connect_error]);
    exit;
}

// Obtém dados JSON da requisição
$data = json_decode(file_get_contents('php://input'), true);

// Verifica se todos os campos estão presentes
$required_fields = ['cpf', 'nomeCompleto', 'email', 'senha', 'sexo', 'telefone', 'dataNascimento', 'horario', 'bartenders', 'convidados', 'valorTotalFormatado', 'img', 'title', 'description'];

foreach ($required_fields as $field) {
    if (!isset($data[$field]) || empty($data[$field])) {
        echo json_encode(['error' => 'Campo ausente ou vazio: ' . $field]);
        exit;
    }
}

// Sanitiza os dados
$cpf = $conn->real_escape_string($data['cpf']);
$nomeCompleto = $conn->real_escape_string($data['nomeCompleto']);
$email = $conn->real_escape_string($data['email']);
$senha = $conn->real_escape_string($data['senha']);
$sexo = $conn->real_escape_string($data['sexo']);
$telefone = $conn->real_escape_string($data['telefone']);
$dataNascimento = $conn->real_escape_string($data['dataNascimento']);
$horario = $conn->real_escape_string($data['horario']);
$bartenders = $conn->real_escape_string($data['bartenders']);
$convidados = $conn->real_escape_string($data['convidados']);
$valorTotalFormatado = $conn->real_escape_string($data['valorTotalFormatado']);
$img = $conn->real_escape_string($data['img']);
$title = $conn->real_escape_string($data['title']);
$description = $conn->real_escape_string($data['description']);

// Prepara e vincula
$stmt = $conn->prepare("INSERT INTO usuarios (cpf, nome_completo, email, senha, sexo, telefone, data_nascimento, horario, bartenders, convidados, valor_total_formatado, img, title, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssssssiiisss", $cpf, $nomeCompleto, $email, $senha, $sexo, $telefone, $dataNascimento, $horario, $bartenders, $convidados, $valorTotalFormatado, $img, $title, $description);

// Executa a inserção
if ($stmt->execute()) {
    echo json_encode(['success' => 'Dados inseridos com sucesso']);
} else {
    echo json_encode(['error' => 'Erro ao inserir dados: ' . $stmt->error]);
}

// Fecha a conexão
$stmt->close();
$conn->close();
?>
