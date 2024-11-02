<?php
require_once __DIR__ . '/../vendor/autoload.php';
header("Access-Control-Allow-Origin: *"); // Permite qualquer origem. Para maior segurança, especifique o domínio exato.
header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); // Permite os métodos HTTP desejados.
header("Access-Control-Allow-Headers: Content-Type"); // Permite os cabeçalhos que você está usando.
header("Content-Type: application/json; charset=UTF-8");

// Verifique se é uma solicitação OPTIONS (pré-vôo) e apenas responda com os cabeçalhos.
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

$servername = $_ENV['DB_HOST'];
$username = $_ENV['DB_USER'];
$password = $_ENV['DB_PASS'];
$dbname = $_ENV['DB_NAME'];

// Conexão com o banco de dados
try {
    $pdo = new PDO("mysql:host=$servername; dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["erro" => "Erro de conexão: " . $e->getMessage()]);
    exit();
}

// Simula um termo de pesquisa vindo do corpo da solicitação
$data = json_decode(file_get_contents("php://input"));
$searchTerm = $data->searchTerm ?? '';

// SQL para buscar pacotes e drinks relacionados
$sql = "
    SELECT 
        p.id AS pacote_id, 
        p.title, 
        p.description AS pacote_description, 
        p.info, 
        p.price, 
        p.img,
        d.nome AS drink_name,
        d.image AS drink_image,
        d.description AS drink_description
    FROM pacotes p
    LEFT JOIN drinks d ON p.id = d.pacote_id
    WHERE p.title LIKE :searchTerm
";

$stmt = $pdo->prepare($sql);
$stmt->execute(['searchTerm' => '%' . $searchTerm . '%']);
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Cria um array para armazenar os pacotes e drinks
$pacotes = [];
foreach ($results as $row) {
    $pacote_id = $row['pacote_id'];

    // Se o pacote ainda não existe no array, inicializa-o
    if (!isset($pacotes[$pacote_id])) {
        $pacotes[$pacote_id] = [
            "id" => $pacote_id,
            "title" => $row['title'],
            "description" => $row['pacote_description'],
            "info" => $row['info'],
            "price" => $row['price'],
            "img" => $row['img'],
            "drinks" => []
        ];
    }

    // Adiciona o drink ao array de drinks do pacote, se existir
    if ($row['drink_name']) {
        $pacotes[$pacote_id]['drinks'][] = [
            "name" => $row['drink_name'],
            "image" => $row['drink_image'],
            "description" => $row['drink_description']
        ];
    }
}

// Organiza o array no formato de valores para JSON
$pacotes = array_values($pacotes);

// Retorna os pacotes com drinks em formato JSON
echo json_encode($pacotes);
?>
