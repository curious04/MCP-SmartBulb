import dgram from 'dgram';
const client = dgram.createSocket('udp4')
const BULB_IP = '192.168.29.235';
const PORT = 38899;

export async function turnOnBulb() {
    const message = JSON.stringify({
        method: 'setState',
        params: {
            state: true,
        },
    });

    client.send(message, PORT, BULB_IP, (err) => {
        if (err) {
            console.log('Error', err);
        }
        client.close();
    });
}

export async function turnOffBulb() {
    const message = JSON.stringify({
        method: 'setState',
        params: {
            state: false,
        },
    });

    client.send(message, PORT, BULB_IP, (err) => {
        if (err) {
            console.log('Error', err);
        }
        client.close();
    });
}

export async function changeColor({
    r,
    g,
    b,
    dimming,
}: {
    r: number;
    b: number;
    g: number;
    dimming: number;
}) {
    const message = JSON.stringify({
        method: 'setState',
        params: {
            state: true,
            dimming,
            r,
            g,
            b,
        },
    })

    client.send(message, PORT, BULB_IP, (err) => {
        if (err) {
            console.log('Error', err);
        }
        client.close();
    });
}