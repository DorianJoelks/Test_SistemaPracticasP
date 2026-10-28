import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '1m', target: 2000 },  // Rampa de subida
        { duration: '3m', target: 2000 },  // Mantenimiento de carga
        { duration: '1m', target: 0 },   // Rampa de bajada
    ],
    thresholds: {
        http_req_duration: ['p(95)<300'], // El 95% de peticiones debe responder en menos de 300ms
        http_req_failed: ['rate<0.01'],   // Menos del 1% de errores permitidos
    },
};

export default function () {
    // Petición externa hacia la IP de la VM (Frontend Next.js)
    const res = http.get('http://172.28.36.26:3000/');
    check(res, {
        'status es 200': (r) => r.status === 200,
    });
    sleep(1);
}