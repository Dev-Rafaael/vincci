<!-- <?php
// header("Access-Control-Allow-Origin: *");
// header("Content-Type: application/json"); // Define que o retorno é JSON

// // Carrega o SDK do Mercado Pago
// require_once __DIR__ . '/../vendor/autoload.php';

// try {
//     MercadoPago\SDK::setAccessToken('TEST-4788467070224111-092722-752ceffb7ce2ee055908a10225ee50ea-1857506377');
    
//     // Criar uma nova preferência de pagamento
//     $preference = new MercadoPago\Preference();

//     $item = new MercadoPago\Item();
//     $item->title = "My product";
//     $item->quantity = 1;
//     $item->unit_price = 2000;
    
//     $preference->items = array($item);
//     $preference->save();
    
//     // Retorna o preferenceId como JSON
//     echo json_encode(['preferenceId' => $preference->id]);

// } catch (Exception $e) {
//     // Captura erros e retorna como JSON
//     http_response_code(500); // Retornar código de erro apropriado
//     echo json_encode([
//         "error" => true,
//         "message" => $e->getMessage()
//     ]);
// }
// ?> -->
