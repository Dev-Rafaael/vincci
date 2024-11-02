<?php
require '../vendor/autoload.php'; // Certifique-se de que o autoload do Composer esteja carregado

// Carrega as variáveis de ambiente
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, DELETE, OPTIONS,PUT");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Definição das variáveis do banco de dados a partir do .env
$servername = $_ENV['DB_HOST'];
$username = $_ENV['DB_USER'];
$password = $_ENV['DB_PASS'];
$dbname = $_ENV['DB_NAME'];

// Cria a conexão com o banco de dados
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica a conexão
if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Falha na conexão com o banco de dados: ' . $conn->connect_error]));
}

// Verifica o método da requisição
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // Função de login
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->email) || empty($data->senha)) {
        echo json_encode(['status' => 'error', 'message' => 'Preencha todos os campos']);
        exit;
    }

    $email = $data->email;
    $senha = $data->senha;

    // Log para verificar se os dados estão corretos
    error_log("Tentativa de login com email: $email");

    // Consulta para verificar o login
    $sql = "SELECT nome_completo,senha,sexo, email, telefone, data_nascimento FROM usuarios WHERE email = ?";
    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("s", $email);

        if ($stmt->execute()) {
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $user = $result->fetch_assoc();

                if (password_verify($senha, $user['senha'])) {
                    // Retorna o usuário com os dados que você precisa
                    echo json_encode(['status' => 'success', 'message' => 'Login bem-sucedido', 'user' => [
                        'email' => $email,
                      'telefone' => $user['telefone'], // Inclua outros campos conforme necessário
                      'nome_completo' => $user['nome_completo'], // Inclua outros campos conforme necessário
                      'data_nascimento' => $user['data_nascimento'],
                      'sexo' => $user['sexo'], // Inclua outros campos conforme necessário
                        // Não inclua a senha aqui
                    ]]);
                } else {
                    echo json_encode(['status' => 'error', 'message' => 'Email ou senha incorretos']);
                }
                
                
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Email ou senha incorretos']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Erro ao executar a consulta: ' . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Erro na preparação da consulta: ' . $conn->error]);
    }

} else if ($method === 'DELETE') {
    // Função para deletar a conta do usuário
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->email) || empty($data->senha)) {
        echo json_encode(['status' => 'error', 'message' => 'Preencha todos os campos']);
        exit;
    }

    $email = $data->email;
    $senha = $data->senha;

    // Consulta para verificar o usuário com base no email
    $sql = "SELECT senha FROM usuarios WHERE email = ?";
    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("s", $email);

        if ($stmt->execute()) {
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $user = $result->fetch_assoc();

                if (password_verify($senha, $user['senha'])) {
                    // Se a senha estiver correta, exclui a conta
                    $deleteSql = "DELETE FROM usuarios WHERE email = ?";
                    if ($deleteStmt = $conn->prepare($deleteSql)) {
                        $deleteStmt->bind_param("s", $email);
                        if ($deleteStmt->execute()) {
                            echo json_encode(['status' => 'success', 'message' => 'Conta deletada com sucesso']);
                        } else {
                            echo json_encode(['status' => 'error', 'message' => 'Erro ao deletar a conta: ' . $deleteStmt->error]);
                        }
                        $deleteStmt->close();
                    }
                } else {
                    echo json_encode(['status' => 'error', 'message' => 'Email ou senha incorretos']);
                }
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Email ou senha incorretos']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Erro ao executar a consulta: ' . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Erro na preparação da consulta: ' . $conn->error]);
    }
}else if ($method === 'PUT') {
    // Decodifica os dados recebidos
    $data = json_decode(file_get_contents("php://input"));

    // Verifica se os dados necessários foram recebidos
    if (isset($data->update) && $data->update === true) {
        // Atualização dos dados do usuário
        $nomeCompleto = $data->nomeCompleto ?? null; // Usando null coalescing para evitar Undefined variable
        $email = $data->email ?? null;
        $sexo = $data->sexo ?? null;
        $dataNascimento = $data->dataNascimento ?? null;
        $telefone = $data->telefone ?? null;

        // Verifica se todos os campos estão preenchidos
        if (!$nomeCompleto || !$email || !$sexo || !$dataNascimento || !$telefone) {
            echo json_encode(['status' => 'error', 'message' => 'Preencha todos os campos']);
            exit; // Interrompe a execução se os campos não estiverem preenchidos
        }

        // Consulta SQL para atualizar os dados do usuário com base no e-mail
        $sql = "UPDATE usuarios SET nome_completo = ?, sexo = ?, data_nascimento = ?, telefone = ? WHERE email = ?";
        if ($stmt = $conn->prepare($sql)) {
            $stmt->bind_param("sssss", $nomeCompleto, $sexo, $dataNascimento, $telefone, $email);

            if ($stmt->execute()) {
                echo json_encode(['status' => 'success', 'message' => 'Conta atualizada com sucesso!']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Erro ao atualizar a conta: ' . $stmt->error]);
            }
            $stmt->close();
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Erro na preparação da consulta: ' . $conn->error]);
        }
    } else {
        // Aqui você pode tratar o caso onde a atualização não é requisitada
        echo json_encode(['status' => 'error', 'message' => 'Atualização não solicitada']);
    }
}
// Fecha a conexão com o banco de dados
$conn->close();
?>
