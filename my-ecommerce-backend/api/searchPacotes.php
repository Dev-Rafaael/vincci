<?php
header("Access-Control-Allow-Origin: *"); // Permite qualquer origem. Para maior segurança, você pode especificar o domínio exato.
header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); // Permite os métodos HTTP que você deseja.
header("Access-Control-Allow-Headers: Content-Type"); // Permite os cabeçalhos que você está usando.

// Verifique se é uma solicitação OPTIONS (pré-vôo) e apenas responda com os cabeçalhos.
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$host = 'localhost';
$dbname = 'vinccipub';
$username = 'vincciBD'; // Ajuste de acordo com sua configuração
$password = 'v*incci***P*u**B2024';

// Conexão com o banco de dados
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Erro de conexão: " . $e->getMessage();
    exit();
}

// Simule um termo de pesquisa
$data = json_decode(file_get_contents("php://input"));
$searchTerm = $data->searchTerm ?? '';

$stmt = $pdo->prepare("SELECT title, description, info, price,img FROM pacotes WHERE title LIKE :searchTerm");
$stmt->execute(['searchTerm' => '%' . $searchTerm . '%']);
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Exibir resultados
echo json_encode($results);
?>
