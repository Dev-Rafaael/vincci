<?php
require_once __DIR__ . '/../vendor/autoload.php';

header("Access-Control-Allow-Origin: *");

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

// Consulta SQL para buscar pacotes e seus drinks associados
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
        d.description AS drink_description,
        ci.image_name AS carousel_image
    FROM pacotes p
    LEFT JOIN drinks d ON p.id = d.pacote_id
    LEFT JOIN carousel_images ci ON p.id = ci.pacote_id
";
$result = $conn->query($sql);

// Cria um array para armazenar os pacotes e drinks
// Cria um array para armazenar os pacotes e drinks
$pacotes = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
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
                "drinks" => [],
                "carousel_images" => []
            ];
        }

        // Adiciona o drink ao array de drinks do pacote, se existir
        if ($row['drink_name'] && !in_array($row['drink_name'], array_column($pacotes[$pacote_id]['drinks'], 'name'))) {
            $pacotes[$pacote_id]['drinks'][] = [
                "name" => $row['drink_name'],
                "image" => $row['drink_image'],
                "description" => $row['drink_description']
            ];
        }

        // Adiciona as imagens do carrossel ao array de imagens, se existir
        if ($row['carousel_image'] && !in_array($row['carousel_image'], $pacotes[$pacote_id]['carousel_images'])) {
            $pacotes[$pacote_id]['carousel_images'][] = $row['carousel_image'];
        }
    }

    // Organiza o array no formato de valores para JSON
    $pacotes = array_values($pacotes);
} else {
    echo json_encode(["mensagem" => "Nenhum pacote encontrado."]);
    exit;
}

// Retorna os pacotes com drinks e imagens do carrossel em formato JSON
header('Content-Type: application/json');
echo json_encode($pacotes);

$conn->close();
