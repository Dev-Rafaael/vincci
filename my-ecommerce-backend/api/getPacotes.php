<?php
header("Access-Control-Allow-Origin: *");

// Configurações de conexão com o banco de dados
$servername = "localhost";
$username = "vincciBD";
$password = "v*incci***P*u**B2024";
$dbname = "vinccipub";

$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica a conexão
if ($conn->connect_error) {
  die("Conexão falhou: " . $conn->connect_error);
}

// Consulta SQL para buscar os pacotes
$sql = "SELECT id, title, description, info, price, img FROM pacotes";
$result = $conn->query($sql);

// Cria um array para armazenar os pacotes
$pacotes = [];

if ($result->num_rows > 0) {
  // Preenche o array com os dados dos pacotes
  while($row = $result->fetch_assoc()) {
    $pacotes[] = $row;
  }
} else {
  echo json_encode(["mensagem" => "Nenhum pacote encontrado."]);
}

// Retorna os pacotes em formato JSON
header('Content-Type: application/json');
echo json_encode($pacotes);

$conn->close();
?>
