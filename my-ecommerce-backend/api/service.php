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
$required_fields = ['cpf', 'nomeCompleto', 'email', 'senha', 'sexo', 'telefone', 'dataNascimento', 'horario', 'bartenders', 'convidados', 'valorTotalFormatado', 'img', 'title', 'description','rua','numeroEndereco','cep','bairro','cidade','estado'];

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
$senha = password_hash($conn->real_escape_string($data['senha']), PASSWORD_BCRYPT); // Hash da senha
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
$rua= $conn->real_escape_string($data['rua']);
$numeroEndereco=$conn->real_escape_string($data['numeroEndereco']);
$cep=$conn->real_escape_string($data['cep']);
$bairro=$conn->real_escape_string($data['bairro']);
$cidade=$conn->real_escape_string($data['cidade']);
$estado=$conn->real_escape_string($data['estado']);
// Prepara e vincula
$stmt = $conn->prepare("INSERT INTO usuarios (cpf, nome_completo, email, senha, sexo, telefone, data_nascimento, horario, bartenders, convidados, valor_total_formatado, img, title, description,rua,numero_endereco,cep,bairro,cidade,estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?)");
$stmt->bind_param("ssssssssiiisssssssss", $cpf, $nomeCompleto, $email, $senha, $sexo, $telefone, $dataNascimento, $horario, $bartenders, $convidados, $valorTotalFormatado, $img, $title, $description,$rua,$numeroEndereco,$cep,$bairro,$cidade,$estado);

// Executa a inserção
if ($stmt->execute()) {
    // Configura as credenciais do Mercado Pago
  // Configura as credenciais do Mercado Pago
  MercadoPago\SDK::setAccessToken($_ENV['MERCADO_PAGO_ACCESS_TOKEN']);

// Cria a preferência
$preference = new MercadoPago\Preference();

// Adiciona os itens à preferência
$item = new MercadoPago\Item();
$item->title = $title;  // Nome do item (capturado no seu formulário)
$item->quantity = 1;
$item->unit_price = floatval($valorTotalFormatado);  // Valor do item
$preference->items = array($item);

// Informações do pagador (payer)
$payer = new MercadoPago\Payer();
$payer->name = $nomeCompleto;  // Nome completo do pagador (capturado no seu formulário)
$payer->email = $email;  // Email do pagador (capturado no seu formulário)
$payer->identification = array(
    "type" => "CPF",
    "number" => $cpf  // Número do CPF (capturado no seu formulário)
);

// Adiciona o endereço do pagador
$payer->address = array(
    "street_name" => $rua,
    "street_number" => $numeroEndereco,
    "zip_code" => $cep,
    "neighborhood" => $bairro,
    "city" => $cidade,
    "state" => $estado,
    "country" => "BR"
);

// Atribui o payer à preferência
$preference->payer = $payer;

// Define as URLs de retorno
$preference->back_urls = array(
    "success" => "http://localhost:5173/",  // URL de sucesso
    "failure" => "http://localhost:5173/Pacotes",  // URL de falha
    "pending" => "http://localhost:5173/Pacotes"   // URL para pagamento pendente
);

// Define o comportamento de redirecionamento automático após o pagamento
$preference->auto_return = "approved";

// Define os métodos de pagamento aceitos: crédito, débito e Pix
$preference->payment_methods = array(
    "excluded_payment_types" => array(),  // Não exclui nenhum tipo de pagamento
    "installments" => 12, // Permite até 12 parcelas no cartão de crédito
    "default_payment_method_id" => null,  // O usuário escolhe o método
    "included_payment_methods" => array(
        array("id" => "pix"),  // Força a inclusão do Pix
        array("id" => "credit_card"),  // Inclui cartão de crédito
        array("id" => "debit_card"),  // Inclui cartão de débito
        array("id" => "ticket")  // Inclui boleto bancário
    )
);
    
// Salva a preferência no Mercado Pago
$preference->save();

// Retorna a URL de pagamento do Mercado Pago junto com o preferenceId
echo json_encode([
    'success' => 'Dados inseridos com sucesso',
    'preferenceId' => $preference->id,
    'init_point' => $preference->init_point, // URL para o checkout no Mercado Pago
    'sandbox_init_point' => $preference->sandbox_init_point, // URL para o checkout em modo sandbox
    'payer' => array(
        'name' => $nomeCompleto,  // Nome do pagador
        'address' => array(
            'street_name' => $rua,
            'street_number' => $numeroEndereco,
            'zip_code' => $cep,
            'neighborhood' => $bairro,
            'city' => $cidade,
            'state' => $estado
        )
    )
]);
} else {
    echo json_encode(['error' => 'Erro ao inserir dados: ' . $stmt->error]);
}

// Fecha a conexão
$stmt->close();
$conn->close();
?>

<?php
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type");
// header("Content-Type: application/json; charset=UTF-8");

// $servername = "localhost";
// $username = "vincciBD";
// $password = "v*incci***P*u**B2024";
// $dbname = "vinccipub";

// Cria conexão
// $conn = new mysqli($servername, $username, $password, $dbname);

// Verifica a conexão
// if ($conn->connect_error) {
//     echo json_encode(['error' => 'Conexão falhou: ' . $conn->connect_error]);
//     exit;
// }

// Obtém dados JSON da requisição
// $data = json_decode(file_get_contents('php://input'), true);

// Verifica se todos os campos estão presentes
// $required_fields = ['cpf', 'nomeCompleto', 'email', 'senha', 'sexo', 'telefone', 'dataNascimento', 'horario', 'bartenders', 'convidados', 'valorTotalFormatado', 'img', 'title', 'description'];

// foreach ($required_fields as $field) {
//     if (!isset($data[$field]) || empty($data[$field])) {
//         echo json_encode(['error' => 'Campo ausente ou vazio: ' . $field]);
//         exit;
//     }
// }

// Sanitiza os dados
// $cpf = $conn->real_escape_string($data['cpf']);
// $nomeCompleto = $conn->real_escape_string($data['nomeCompleto']);
// $email = $conn->real_escape_string($data['email']);
// $senha = $conn->real_escape_string($data['senha']);
// $sexo = $conn->real_escape_string($data['sexo']);
// $telefone = $conn->real_escape_string($data['telefone']);
// $dataNascimento = $conn->real_escape_string($data['dataNascimento']);
// $horario = $conn->real_escape_string($data['horario']);
// $bartenders = $conn->real_escape_string($data['bartenders']);
// $convidados = $conn->real_escape_string($data['convidados']);
// $valorTotalFormatado = $conn->real_escape_string($data['valorTotalFormatado']);
// $img = $conn->real_escape_string($data['img']);
// $title = $conn->real_escape_string($data['title']);
// $description = $conn->real_escape_string($data['description']);

// Prepara e vincula
// $stmt = $conn->prepare("INSERT INTO usuarios (cpf, nome_completo, email, senha, sexo, telefone, data_nascimento, horario, bartenders, convidados, valor_total_formatado, img, title, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
// $stmt->bind_param("ssssssssiiisss", $cpf, $nomeCompleto, $email, $senha, $sexo, $telefone, $dataNascimento, $horario, $bartenders, $convidados, $valorTotalFormatado, $img, $title, $description);

// Executa a inserção
// if ($stmt->execute()) {
//     echo json_encode(['success' => 'Dados inseridos com sucesso']);
// } else {
//     echo json_encode(['error' => 'Erro ao inserir dados: ' . $stmt->error]);
// }

// Fecha a conexão
// $stmt->close();
// $conn->close();
// ?>
