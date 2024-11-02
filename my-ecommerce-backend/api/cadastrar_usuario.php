<?php
require_once __DIR__ . '/../vendor/autoload.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

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
    echo json_encode(['success' => false, 'message' => 'Conexão falhou: ' . $conn->connect_error]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recebe os dados do corpo da requisição
    $data = json_decode(file_get_contents("php://input"), true);

    // Verifica se os dados foram recebidos corretamente
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['success' => false, 'message' => 'Dados JSON inválidos.']);
        exit;
    }

    // Sanitize and validate input
    $cpf = $data['cpf'] ?? null;
    $nome_completo = $data['nome_completo'] ?? null;
    $email = $data['email'] ?? null;
    $senha = password_hash($data['senha'] ?? '', PASSWORD_DEFAULT); // Hash da senha
    $sexo = $data['sexo'] ?? null;
    $telefone = $data['telefone'] ?? null;
    $data_nascimento = $data['data_nascimento'] ?? null;
    $rua = $data['rua'] ?? null;
    $numero_endereco = $data['numero_endereco'] ?? null;
    $cep = $data['cep'] ?? null;
    $bairro = $data['bairro'] ?? null;
    $cidade = $data['cidade'] ?? null;
    $estado = $data['estado'] ?? null;

    // Insere os dados no banco
    $stmt = $conn->prepare("INSERT INTO usuarios (cpf, nome_completo, email, senha, sexo, telefone, data_nascimento, rua, numero_endereco, cep, bairro, cidade, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    if ($stmt) {
        $stmt->bind_param("sssssssssssss", $cpf, $nome_completo, $email, $senha, $sexo, $telefone, $data_nascimento, $rua, $numero_endereco, $cep, $bairro, $cidade, $estado);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Usuário cadastrado com sucesso!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Erro ao cadastrar: ' . $stmt->error]);
        }

        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao preparar a consulta: ' . $conn->error]);
    }
}

$conn->close();


?>
<?php
// require_once __DIR__ . '/../vendor/autoload.php';

// use PHPMailer\PHPMailer\PHPMailer;
// use PHPMailer\PHPMailer\Exception;

// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type");
// header("Content-Type: application/json; charset=UTF-8");

// // Configurações de conexão com o banco de dados
// $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
// $dotenv->load();

// $servername = $_ENV['DB_HOST'];
// $username = $_ENV['DB_USER'];
// $password = $_ENV['DB_PASS'];
// $dbname = $_ENV['DB_NAME'];

// $conn = new mysqli($servername, $username, $password, $dbname);

// // Verifica a conexão
// if ($conn->connect_error) {
//     die("Conexão falhou: " . $conn->connect_error);
// }

// if ($_SERVER["REQUEST_METHOD"] == "POST") {
//     // Recebe os dados do corpo da requisição
//     $data = json_decode(file_get_contents("php://input"), true);

//     // Dados do usuário
//     $cpf = $data['cpf'];
//     $nome_completo = $data['nome_completo'];
//     $email = $data['email'];
//     $senha = password_hash($data['senha'], PASSWORD_DEFAULT); // Hash da senha
//     $sexo = $data['sexo'];
//     $telefone = $data['telefone'];
//     $data_nascimento = $data['data_nascimento'];
//     $rua = $data['rua'];
//     $numero_endereco = $data['numero_endereco'];
//     $cep = $data['cep'];
//     $bairro = $data['bairro'];
//     $cidade = $data['cidade'];
//     $estado = $data['estado'];

//     // Gera um token de verificação
//     $token = bin2hex(random_bytes(16));

//     // Insere os dados no banco, incluindo o token
//     $stmt = $conn->prepare("INSERT INTO usuarios (cpf, nome_completo, email, senha, sexo, telefone, data_nascimento, rua, numero_endereco, cep, bairro, cidade, estado, token) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
//     $stmt->bind_param("ssssssssssssss", $cpf, $nome_completo, $email, $senha, $sexo, $telefone, $data_nascimento, $rua, $numero_endereco, $cep, $bairro, $cidade, $estado, $token);

//     if ($stmt->execute()) {
//         // URL para o link de verificação
//         $verification_link = "http://localhost/ecommerce-pub/my-ecommerce-backend/api/verificy.php?email=$email&token=$token";

//         // Configuração e envio de e-mail com PHPMailer
//         $mail = new PHPMailer(true);
        
//         try {
//             $mail->isSMTP();
//             $mail->Host = 'smtp.gmail.com'; // Substitua pelo seu host SMTP
//             $mail->SMTPAuth = true;
//             $mail->Username = 'rafael1327@gmail.com'; // Seu e-mail SMTP
//             $mail->Password = '123'; // Sua senha SMTP
//             $mail->SMTPSecure = 'tls';
//             $mail->Port = 587;

//             $mail->setFrom('vincciPub@gmail.com', 'Nome do Site');
//             $mail->addAddress($email);

//             $mail->isHTML(true);
//             $mail->Subject = 'Confirmação de E-mail';
//             $mail->Body = "<p>Olá $nome_completo,</p><p>Por favor, confirme seu e-mail clicando no link abaixo:</p><p><a href='$verification_link'>$verification_link</a></p>";

//             $mail->send();
//             echo json_encode(['success' => true, 'message' => 'Usuário cadastrado com sucesso! Verifique seu e-mail para ativar sua conta.']);
//         } catch (Exception $e) {
//             echo json_encode(['success' => false, 'message' => 'Erro ao enviar e-mail de verificação: ' . $mail->ErrorInfo]);
//         }
//     } else {
//         echo json_encode(['success' => false, 'message' => 'Erro ao cadastrar: ' . $stmt->error]);
//     }

//     $stmt->close();
// }

// $conn->close();
// ?>
