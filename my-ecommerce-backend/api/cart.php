<?php
header("Content-Type: application/json");
require '../bd.php';  // Importa a conexão com o banco de dados

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        // Adicionar item ao carrinho
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (isset($data['pacotes_id']) && isset($data['users_id'])) {
            $stmt = $pdo->prepare("INSERT INTO carrinho (users_id, pacotes_id, quantidade) VALUES (?, ?, ?)");
            $stmt->execute([$data['users_id'], $data['pacotes_id'], $data['quantidade'] ?? 1]);
            echo json_encode(["message" => "Item adicionado ao carrinho."]);
        } else {
            echo json_encode(["error" => "Dados inválidos"]);
        }
        break;

    case 'GET':
        // Recuperar itens do carrinho
        if (isset($_GET['users_id'])) {
            $users_id = $_GET['users_id'];
            $stmt = $pdo->prepare("SELECT * FROM carrinho WHERE users_id = ?");
            $stmt->execute([$users_id]);
            $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($items);
        } else {
            echo json_encode(["error" => "ID do usuário não fornecido."]);
        }
        break;

    case 'DELETE':
        // Remover item do carrinho
        if (isset($_GET['item_id'])) {
            $item_id = $_GET['item_id'];
            $stmt = $pdo->prepare("DELETE FROM carrinho WHERE id = ?");
            $stmt->execute([$item_id]);
            echo json_encode(["message" => "Item removido do carrinho."]);
        } else {
            echo json_encode(["error" => "ID do item não fornecido."]);
        }
        break;

    default:
        echo json_encode(["error" => "Método não suportado."]);
}
?>
